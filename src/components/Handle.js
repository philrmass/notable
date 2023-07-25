import styles from './Handle.module.css';

export default function Handle() {
  const width = 4;
  const height = 6;
  const indices = [...Array(width * height).keys()];

  return (
    <div className={styles.handle}>
      {indices.map((index) => (
        <div key={index} className={styles.box}>
          <div className={styles.dot} />
        </div>
      ))}
    </div>
  );
}
