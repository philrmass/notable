import classnames from 'classnames';
import styles from './Colors.module.css';

const colors = [
  'var(--note0)',
  'var(--note1)',
  'var(--note2)',
  'var(--note3)',
  'var(--note7)',
  'var(--note6)',
  'var(--note5)',
  'var(--note4)',
];

export default function Colors({
  color,
  onColorSelect,
}) {
  return (
    <div className={styles.colors}>
      { colors.map((c) => {
        const classes = classnames(
          styles.color,
          { [styles.selected]: c === color },
        );

        return (
          <button
            key={c}
            style={{ background: c }}
            className={classes}
            onClick={() => onColorSelect(c)}
          />
        );
      }) }
    </div>
  );
}
