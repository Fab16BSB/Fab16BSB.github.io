/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import { Icon } from '@/components/ui/Icon/Icon';
import { formatPostDate } from '../publications.helpers';
import styles from '../Publications.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type MediumPostCardProps = {
  post: MediumPost;
  locale: Locale;
  index: number;
};

/* =========================================================================
  COMPOSANT : MediumPostCard
  Carte d'un article Medium.
========================================================================= */
export function MediumPostCard({ post, locale, index }: MediumPostCardProps) {
  const { t } = useI18n();

  return (
    <a
      className={styles.post}
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ '--reveal-delay': `${index * 50}ms` } as CSSProperties}
      data-reveal
    >
      {/* Illustration, masquée si elle ne charge pas. */}
      <span className={styles.postImage}>
        {post.image ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            width={640}
            height={360}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className={styles.postPlaceholder}>Medium</span>
        )}
      </span>

      <span className={styles.postBody}>
        {/* Titre et extrait de l'article. */}
        <span className={styles.postTitle}>{post.title}</span>
        <span className={styles.postExcerpt}>{post.excerpt}</span>

        <span className={styles.postBottom}>
          {/* Date et temps de lecture. */}
          <span className={styles.postMeta}>
            <span className={styles.postDate}>
              <Icon name="calendar" size={12} />
              {formatPostDate(post.publishedAt, locale)}
            </span>
            <span className={styles.readTime}>
              <Icon name="clock" size={12} />
              {post.readingTime} {t('publications.minutes')}
            </span>
          </span>

          {/* Lien vers Medium. */}
          <span className={styles.postFooter}>
            {t('publications.readOnMedium')}
            <Icon name="arrow-up-right" size={15} />
          </span>
        </span>
      </span>
    </a>
  );
}
