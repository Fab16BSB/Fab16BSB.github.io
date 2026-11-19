/* =========================================================================
  HELPERS : vecteurs — fonctions pures
  Moyenne, normalisation et centrage des embeddings.
========================================================================= */

/**
 * Calcule la moyenne de plusieurs vecteurs.
 *
 * @param vectors - Vecteurs à moyenner.
 * @param dimension - Dimension des vecteurs.
 * @returns La moyenne, de même dimension.
 */
export function meanVector(
  vectors: Float32Array[],
  dimension: number,
): Float32Array {
  const mean = new Float32Array(dimension);

  for (const vector of vectors) {
    for (let index = 0; index < mean.length; index += 1) {
      mean[index] += vector[index] / vectors.length;
    }
  }

  return mean;
}

/**
 * Normalise un vecteur à une norme de 1.
 *
 * @param vector - Vecteur à normaliser.
 * @returns Une copie de norme 1.
 */
export function normalizeVector(vector: Float32Array): Float32Array {
  const result = new Float32Array(vector);
  let norm = 0;

  for (const value of result) {
    norm += value * value;
  }

  const scale = norm > 0 ? 1 / Math.sqrt(norm) : 0;

  for (let index = 0; index < result.length; index += 1) {
    result[index] *= scale;
  }

  return result;
}

/**
 * Centre un vecteur sur la moyenne du corpus puis le normalise.
 *
 * @param vector - Vecteur brut.
 * @param mean - Moyenne du corpus.
 * @returns Le vecteur centré de norme 1.
 */
export function centerAndNormalize(
  vector: Float32Array,
  mean: Float32Array,
): Float32Array {
  const centered = new Float32Array(vector.length);
  let norm = 0;

  for (let index = 0; index < vector.length; index += 1) {
    const value = vector[index] - mean[index];
    centered[index] = value;
    norm += value * value;
  }

  const scale = norm > 0 ? 1 / Math.sqrt(norm) : 0;

  for (let index = 0; index < centered.length; index += 1) {
    centered[index] *= scale;
  }

  return centered;
}

/**
 * Calcule le centroïde de plusieurs vecteurs, puis le normalise.
 *
 * @param vectors - Vecteurs d'un même contenu.
 * @param dimension - Dimension des vecteurs.
 * @returns Le centroïde de norme 1.
 */
export function centroid(
  vectors: Float32Array[],
  dimension: number,
): Float32Array {
  return normalizeVector(meanVector(vectors, dimension));
}
