/**
 * Démarrage anticipé du splash.
 * Ce module ne dépend pas de React : il est chargé avant le bundle de
 * l'application pour afficher les particules au plus tôt.
 */

import { startBootSplash } from '@/boot-splash/boot-splash';

startBootSplash();
