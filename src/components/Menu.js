import Modal from './Modal';
import styles from './Menu.module.css';

export default function Menu({
  onClose,
  shown,
}) {
  return (
    <Modal
      shown={shown}
      onClose={onClose}
    >
      <div className={styles.menu}>
        Delete Note
      </div>
    </Modal>
  );
}
