import Modal from './Modal';
import styles from './MoveDownParents.module.css';

export default function MoveDownParents({
  moveDownId,
  notes,
  parentId,
  shown,
  onClose,
  onSelect,
}) {
  const parent = notes[parentId];
  const filtered = parent.children.filter((id) => id !== moveDownId);

  const renderNote = (id) => {
    const note = notes[id];
    const style = { background: note.color };

    return (
      <button
        key={id}
        className={styles.note}
        style={style}
        onClick={() => onSelect(id)}
      >
        { note.text }
      </button>
    );
  };

  return (
    <Modal
      shown={shown}
      onClose={onClose}
    >
      <div className={styles.message}>
        Select a new parent note
      </div>
      <div className={styles.notes}>
        { filtered.map((id) => renderNote(id)) }
      </div>
    </Modal>
  );
}
