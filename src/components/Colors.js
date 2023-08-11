import classnames from 'classnames';
import styles from './Colors.module.css';

export default function Colors({
  colors,
  selected,
  onSelect,
}) {
  return (
    <div className={styles.colors}>
      { colors.map((c, index) => {
        const classes = classnames(
          styles.color,
          { [styles.selected]: c === selected },
        );

        return (
          <button
            key={c}
            style={{ background: c }}
            className={classes}
            onClick={() => onSelect(c, index)}
          />
        );
      }) }
    </div>
  );
}
