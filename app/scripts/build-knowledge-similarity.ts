/**
 * Calcule les voisins sémantiques de tous les contenus du portfolio.
 *
 * Le script encode chaque contenu dans les trois langues avec le même modèle
 * que la recherche, moyenne les vecteurs par contenu, puis écrit uniquement
 * les meilleurs voisins. Le navigateur ne charge donc aucun modèle.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { extractContentNodes } from '../src/lib/knowledge/knowledge-extract';
import { KNOWLEDGE_RANKING } from '../src/lib/knowledge/knowledge.config';
import { EMBEDDING_CONFIG } from '../src/lib/search/search.config';
import {
  centerAndNormalize,
  centroid,
  meanVector,
} from '../src/lib/search/vector-math';
import { hashKnowledgeSource } from './knowledge-source-hash';
import type { Locale } from '../src/types/common.types';
import type {
  KnowledgeContentNode,
  KnowledgeSimilarityDocument,
  KnowledgeSimilarityIndex,
} from '../src/types/knowledge.types';

/* =========================================================================
  CONFIGURATION
========================================================================= */

/** Répertoire du script, pour résoudre les chemins. */
const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Fichier de sortie de l'index de similarité. */
const outputPath = resolve(scriptDir, '../src/data/knowledge/knowledge-similarity.json');

/** Cache local du modèle d'embedding. */
const cacheDir = resolve(scriptDir, '../.cache/transformers');

/** Langues encodées pour chaque contenu. */
const locales: Locale[] = ['fr', 'en', 'es'];

/** Nombre de textes encodés par lot. */
const batchSize = 8;

/** Nombre de voisins conservés par contenu. */
const TOP_K = 10;

/** Cosinus minimal pour retenir une paire, sur l'échelle brute. */
const MIN_COSINE = 0.1;

env.cacheDir = cacheDir;
env.allowLocalModels = false;
env.allowRemoteModels = true;

/* =========================================================================
  TYPES
========================================================================= */

/**
 * Texte d'un contenu dans une langue donnée.
 *
 * @property {string} nodeId - Identifiant global du contenu.
 * @property {Locale} locale - Langue du texte.
 * @property {string} text - Texte à encoder.
 */
type TextEntry = {
  nodeId: string;
  locale: Locale;
  text: string;
};

/* =========================================================================
  HELPERS : vecteurs
========================================================================= */

/**
 * Produit un score d'affichage entre 0 et 1, recentré sur le plancher commun.
 *
 * @param cosine - Cosinus brut entre deux contenus.
 * @returns Le score normalisé, arrondi au millième.
 */
function displayScore(cosine: number): number {
  const floor = KNOWLEDGE_RANKING.similarityScoreFloor;
  const normalized = (cosine - floor) / (1 - floor);

  return Math.round(Math.max(0, Math.min(1, normalized)) * 1000) / 1000;
}

/**
 * Encode des textes en vecteurs, par lots.
 *
 * @param extractor - Pipeline d'extraction.
 * @param texts - Textes à encoder.
 * @returns Les vecteurs normalisés, dans l'ordre des textes.
 */
async function embedTexts(
  extractor: FeatureExtractionPipeline,
  texts: string[],
): Promise<Float32Array[]> {
  const vectors: Float32Array[] = [];

  for (let start = 0; start < texts.length; start += batchSize) {
    const batch = texts
      .slice(start, start + batchSize)
      .map((text) => `${EMBEDDING_CONFIG.passagePrefix}${text}`);
    const output = await extractor(batch, { pooling: 'mean', normalize: true });
    const data = output.data as Float32Array;

    for (let index = 0; index < batch.length; index += 1) {
      const offset = index * EMBEDDING_CONFIG.dimension;
      vectors.push(data.slice(offset, offset + EMBEDDING_CONFIG.dimension));
    }
  }

  return vectors;
}

/* =========================================================================
  HELPERS : contenus
========================================================================= */

/**
 * Collecte les textes d'un contenu dans les trois langues.
 *
 * @param nodes - Contenus du portfolio.
 * @returns Les entrées à encoder.
 */
function collectEntries(nodes: KnowledgeContentNode[]): TextEntry[] {
  const entries: TextEntry[] = [];

  for (const node of nodes) {
    for (const locale of locales) {
      const text = node.text[locale]?.trim();
      if (text) entries.push({ nodeId: node.id, locale, text });
    }
  }

  return entries;
}

/* =========================================================================
  HELPERS : voisins
========================================================================= */

/**
 * Construit les voisins d'un contenu, sous forme compacte `[id, score]`.
 *
 * @param candidates - Scores et contenus candidats.
 * @returns Les voisins triés, limités à `TOP_K`.
 */
function rankNeighbors(
  candidates: Array<{ node: KnowledgeContentNode; cosine: number }>,
): Array<[string, number]> {
  return candidates
    .filter((candidate) => candidate.cosine >= MIN_COSINE)
    .sort(
      (left, right) =>
        right.cosine - left.cosine ||
        left.node.id.localeCompare(right.node.id),
    )
    .slice(0, TOP_K)
    .map((candidate) => [candidate.node.id, displayScore(candidate.cosine)]);
}

/* =========================================================================
  EXÉCUTION
========================================================================= */

/**
 * Point d'entrée du script : encode les contenus et écrit l'index de similarité.
 */
async function main(): Promise<void> {
  const extraction = extractContentNodes();
  const entries = collectEntries(extraction.nodes);
  let lastProgress = -10;

  console.log(`${extraction.nodes.length} contenus, ${entries.length} textes à encoder`);

  const extractor = await pipeline('feature-extraction', EMBEDDING_CONFIG.model, {
    dtype: EMBEDDING_CONFIG.dtype,
    revision: EMBEDDING_CONFIG.revision,
    progress_callback: (info) => {
      if (info.status === 'progress_total' && info.progress - lastProgress >= 10) {
        lastProgress = info.progress;
        console.log(`Modèle : ${Math.round(info.progress)} %`);
      }
    },
  });

  const rawVectors = await embedTexts(
    extractor,
    entries.map((entry) => entry.text),
  );
  const mean = meanVector(rawVectors, EMBEDDING_CONFIG.dimension);
  const centered = rawVectors.map((vector) => centerAndNormalize(vector, mean));

  const vectorsByNode = new Map<string, Float32Array[]>();
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const vectors = vectorsByNode.get(entry.nodeId) ?? [];
    vectors.push(centered[index]);
    vectorsByNode.set(entry.nodeId, vectors);
  }

  const centroids = new Map<string, Float32Array>();
  for (const [nodeId, vectors] of vectorsByNode) {
    centroids.set(
      nodeId,
      centroid(vectors, EMBEDDING_CONFIG.dimension),
    );
  }

  const nodesById = new Map(extraction.nodes.map((node) => [node.id, node]));
  const candidatesByNode = new Map<string, Array<{ node: KnowledgeContentNode; cosine: number }>>();
  const ids = [...centroids.keys()].sort();

  for (const id of ids) {
    candidatesByNode.set(id, []);
  }

  for (let leftIndex = 0; leftIndex < ids.length; leftIndex += 1) {
    const leftId = ids[leftIndex];
    const left = centroids.get(leftId);
    const leftNode = nodesById.get(leftId);
    if (!left || !leftNode) continue;

    for (let rightIndex = leftIndex + 1; rightIndex < ids.length; rightIndex += 1) {
      const rightId = ids[rightIndex];
      const right = centroids.get(rightId);
      const rightNode = nodesById.get(rightId);
      if (!right || !rightNode) continue;

      let cosine = 0;
      for (let dimension = 0; dimension < left.length; dimension += 1) {
        cosine += left[dimension] * right[dimension];
      }
      if (cosine < MIN_COSINE) continue;

      candidatesByNode.get(leftId)?.push({ node: rightNode, cosine });
      candidatesByNode.get(rightId)?.push({ node: leftNode, cosine });
    }
  }

  const documents: Record<string, KnowledgeSimilarityDocument> = {};
  for (const id of ids) {
    documents[id] = {
      neighbors: rankNeighbors(candidatesByNode.get(id) ?? []),
    };
  }

  const index: KnowledgeSimilarityIndex = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model: {
      name: EMBEDDING_CONFIG.model,
      revision: EMBEDDING_CONFIG.revision,
      dimension: EMBEDDING_CONFIG.dimension,
    },
    sources: Object.fromEntries(
      extraction.nodes.map((node) => [
        node.id,
        hashKnowledgeSource(node),
      ]),
    ),
    documents,
  };

  const topScores = ids
    .map((id) => documents[id].neighbors[0]?.[1] ?? 0)
    .sort((left, right) => left - right);
  const median = topScores[Math.floor(topScores.length / 2)] ?? 0;
  const covered = ids.filter((id) => documents[id].neighbors.length > 0).length;

  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(
    `Index écrit : ${ids.length} contenus, ${covered} avec au moins un voisin.`,
  );
  console.log(
    `Score du meilleur voisin : médiane ${median.toFixed(3)}, min ${topScores[0]?.toFixed(3) ?? '-'}, max ${topScores[topScores.length - 1]?.toFixed(3) ?? '-'}.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Calcul de la similarité impossible — fichier précédent conservé', message);
  process.exitCode = 1;
});
