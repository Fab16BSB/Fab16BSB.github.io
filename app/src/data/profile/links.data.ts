/**
 * Liens externes du site.
 *
 * @property {Object} thesis - Liens de la thèse.
 * @property {string} thesis.pdf - PDF de la thèse sur HAL.
 * @property {string} thesis.hal - Notice HAL de la thèse.
 * @property {string} thesis.repo - Dépôt GitHub de la thèse.
 * @property {Object} social - Réseaux personnels et communauté Override.
 * @property {string} social.medium - Medium personnel.
 * @property {string} social.linkedin - Profil LinkedIn.
 * @property {string} social.github - Profil GitHub.
 * @property {string} social.kaggle - Profil Kaggle.
 * @property {string} social.youtubeChannel - Chaîne YouTube.
 * @property {string} social.youtubeDemo - Vidéo de démonstration.
 * @property {string} social.discord - Serveur Discord de la communauté.
 * @property {string} social.overrideGithub - GitHub de la communauté Override.
 * @property {string} social.overrideMedium - Medium de la communauté Override.
 * @property {Object} organizations - Structures citées dans le parcours.
 * @property {string} organizations.sit - Site de l'IUT de Montreuil.
 * @property {string} organizations.othello - Site d'Othello.
 * @property {string} organizations.lab - Page du laboratoire LIASD.
 * @property {string} organizations.leasup - Site de Leasup.
 * @property {string} organizations.quatorze - Site de Quatorze-IG.
 * @property {string} organizations.directannonces - Site de Directannonces.
 * @property {string} organizations.soldout - Page Twitter de Soldout.
 */
export const links = {
  thesis: {
    pdf: 'https://hal.science/tel-04792952v1/file/2023PA080032_POIRIER_Det.pdf',
    hal: 'https://hal.science/tel-04792952',
    repo: 'https://github.com/Fab16BSB/These',
  },

  social: {
    medium: 'https://medium.com/@fab.16',
    linkedin: 'https://www.linkedin.com/in/fabien-poirier1/',
    github: 'https://github.com/Fab16BSB',
    kaggle: 'https://www.kaggle.com/fpoirier',
    youtubeChannel: 'https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A',
    youtubeDemo: 'https://www.youtube.com/watch?v=EGHUEPMI4c8',
    discord: 'https://discord.gg/pgEUk9xVKe',
    overrideGithub: 'https://github.com/override-community',
    overrideMedium: 'https://medium.com/@overridecommunity',
  },

  organizations: {
    sit: 'https://www.iut.univ-paris8.fr',
    othello: 'https://othello.group',
    lab: 'https://www.univ-paris8.fr/UR-Laboratoire-d-Intelligence-Artificielle-et-Semantique-des-Donnees-LIASD',
    leasup: 'https://www.leasup.com',
    quatorze: 'https://www.quatorze-ig.com',
    directannonces: 'https://www.directannonces.com',
    soldout: 'https://mobile.twitter.com/soldoutapp',
  },
} as const;
