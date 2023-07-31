import Modal from './Modal';
import styles from './ConfirmDelete.module.css';

export default function ConfirmDelete({
  count,
  onDelete,
  onClose,
}) {
  const s = count > 1 ? 's' : '';

  return (
    <Modal
      shown={count > 0}
      onClose={onClose}
    >
      <div className={styles.text}>
        { `Are you sure you want to delete this\nnote and its ${count} descendant${s}` }
      </div>
      <div className={styles.buttons}>
        <button onClick={onClose}>
          Cancel
        </button>
        <button className={styles.delete} onClick={onDelete}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
