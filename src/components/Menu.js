import Modal from './Modal';
import styles from './Menu.module.css';

export default function Menu({
  deleteNote,
  goTo,
  id,
  moveDown,
  moveFirst,
  moveUp,
  onClose,
  hasParent,
}) {
  const handleChildren = () => {
    goTo(`/notes/${id}`);
    onClose();
  };

  const handleDelete = () => {
    deleteNote(id);
    onClose();
  };

  const handleEdit = () => {
    goTo(`/notes/${id}/edit`);
    onClose();
  };

  const handleMoveDown = () => {
    moveDown(id);
    onClose();
  };

  const handleMoveFirst = () => {
    moveFirst(id);
    onClose();
  };

  const handleMoveUp = () => {
    moveUp(id);
    onClose();
  };

  const renderButton = (text, fcn) => (
    <button onClick={fcn}>
      { text }
    </button>
  );

  return (
    <Modal
      shown={Boolean(id)}
      onClose={onClose}
    >
      <div className={styles.menu}>
        { renderButton('Delete', handleDelete) }
        { hasParent && (
          renderButton('Move Up a Level', handleMoveUp) 
        )}
        { renderButton('Move Down a Level', handleMoveDown) }
        { renderButton('Move to First', handleMoveFirst) }
        { renderButton('Edit Children', handleChildren) }
        { renderButton('Edit', handleEdit) }
      </div>
    </Modal>
  );
}
