import Modal from './Modal';
import styles from './MonthlySave.module.css';

export default function MonthlySave({
  onClose,
  onSave,
  shown,
}) {
  const handleSave = () => {
    onSave();
    onClose();
  };

  const renderButton = (text, fcn) => (
    <button onClick={fcn}>
      { text }
    </button>
  );

  return (
    <Modal
      shown={shown}
      onClose={onClose}
    >
      <div className={styles.message}>
        { 'Would you like to back up\nyour data?' }
      </div>
      <div className={styles.menu}>
        { renderButton('Save Back Up', handleSave) }
        { renderButton('Cancel', onClose) }
      </div>
    </Modal>
  );
}
