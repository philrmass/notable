import classnames from 'classnames';
import styles from './Colors.module.css';

const colors = [
  'lch(80 50 0)',
  'lch(80 50 45)',
  'lch(80 50 90)',
  'lch(80 50 135)',
  'lch(80 50 315)',
  'lch(80 50 270)',
  'lch(80 50 225)',
  'lch(80 50 180)',
];

export default function Colors({
  color,
  onColorSelect,
}) {
  return (
    <div className={styles.colors}>
      { colors.map((col) => {
        const classes = classnames(
          styles.color,
          { [styles.selected]: col === color },
        );

        return (
          <button
            key={col}
            style={{ background: col }}
            className={classes}
            onClick={() => onColorSelect(col)}
          />
        );
      }) }
    </div>
  );
}
