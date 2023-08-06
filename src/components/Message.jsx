import Modal from './Modal';
import styles from './Message.module.css';

export default function Message({
  message,
  onClose,
}) {
  return (
    <Modal
      shown={message}
      onClose={onClose}
    >
      <div className={styles.message}>
        { message }
      </div>
    </Modal>
  );
}
