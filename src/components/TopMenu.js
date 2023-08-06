import Modal from './Modal';
import styles from './Menu.module.css';

export default function Menu({
  exportNotes,
  importNotes,
  onClose,
  shown,
}) {
  const handleAdd= () => {
    importNotes(true);
    onClose();
  };

  const handleImport = () => {
    importNotes(false);
    onClose();
  };

  const handleExport = () => {
    exportNotes();
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
      <div className={styles.menu}>
        { renderButton('Add Notes', handleAdd) }
        { renderButton('Import Notes', handleImport) }
        { renderButton('Export Notes', handleExport) }
      </div>
    </Modal>
  );
}
