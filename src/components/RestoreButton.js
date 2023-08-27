import Icon from 'utilities/Icon';
import styles from './RestoreButton.module.css';

export default function RestoreButton({
  shown,
  onClick,
}) {
  if (!shown) {
    return null;
  }
  
  return (
    <div className={styles.wrap}>
      <button
        className="icon-button"
        onClick={onClick}
      >
        <Icon name="revert" className="icon" />
      </button>
    </div>
  );
}
