import classnames from 'classnames';
import { useLocalStorage } from 'utilities/hooks';
import styles from './Colors.module.css';

export const defaultColors = [
  'lch(80 50 0deg)',
  'lch(80 50 45deg)',
  'lch(80 50 90deg)',
  'lch(80 50 135deg)',
  'lch(77 10 270deg)',
  'lch(73 20 30deg)',
  'lch(80 50 315deg)',
  'lch(80 50 270deg)',
];

export default function Colors({
  color,
  onSelect,
}) {
  const [colors] = useLocalStorage('nColors', defaultColors);

  return (
    <div className={styles.colors}>
      { colors.map((c, index) => {
        const classes = classnames(
          styles.color,
          { [styles.selected]: c === color },
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
