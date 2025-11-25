import styles from './Skeleton.module.css';

interface SkeletonProps {
  variant?: 'rect' | 'circle' | 'text';
  width?: number | string;
  height?: number | string;
  count?: number; // text lines複数
}

const Skeleton = ({ variant='rect', width='100%', height, count=1 }: SkeletonProps) => {
  if (variant === 'text') {
    return (
      <div className={styles.wrapper} aria-hidden="true">
        {Array.from({ length: count }).map((_,i) => (
          <div
            key={i}
            className={`${styles.base} ${styles.textLine}`}
            style={{ width }}
          />
        ))}
      </div>
    );
  }
  const className = `${styles.base} ${variant === 'circle' ? styles.circle : styles.rect}`;
  return (
    <div
      className={className}
      style={{ width, height: height ?? (variant === 'circle' ? width : undefined) }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
