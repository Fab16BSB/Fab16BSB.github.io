/* =======================================================================
  DONNÉES
======================================================================= */

// Données du graphe injectées au build ; null dans la source.
const DATA = /*__KNOWLEDGE_GRAPH_DATA__*/ null;

// URL de base du portfolio : racine du viewer en dev et en production,
// site public quand le fichier HTML est ouvert directement.
const SITE_URL = window.location.protocol === 'file:'
  ? 'https://fab16bsb.github.io/'
  : new URL('../', window.location.href).href;
