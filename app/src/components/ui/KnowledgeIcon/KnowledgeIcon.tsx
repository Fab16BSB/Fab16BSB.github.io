/* =========================================================================
  IMPORTS
========================================================================= */
import type { KnowledgeDomainId } from '@/types/skill.types';
import { knowledgePaths } from './paths/knowledgePaths';

/* =========================================================================
  INTERFACE
========================================================================= */
type KnowledgeIconProps = {
  name: KnowledgeDomainId;
  size?: number;
  className?: string;
};

/* =========================================================================
  COMPOSANT : KnowledgeIcon
  Icône de domaine de connaissance.
========================================================================= */
export function KnowledgeIcon({ name, size = 26, className }: KnowledgeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Tracé du domaine demandé. */}
      {knowledgePaths[name]}
    </svg>
  );
}
