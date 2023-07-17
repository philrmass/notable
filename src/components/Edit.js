import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import styles from './Edit.module.css';

function getDefaultNote(id, color) {
  return {
    at: Date.now(),
    children: [],
    color,
    text: '',
    id,
  };
}

export default function Edit({
  id,
  notes,
  parentId,
  saveNote,
}) {
  const [note, setNote] = useState(notes[id] ?? {});
  const isComplete = Boolean(note.text);

  useEffect(() => {
    const existing = notes[id];
    if (existing) {
      setNote(existing);
    } else {
      // ??? use existing color, parent color or last color
      setNote(getDefaultNote(id, '#f0f0ff'));
    }
  }, [notes, id]);

  // ??? handleColorChange

  const handleTextChange = (text) => {
    console.log('text', text);
    setNote((note) => ({ ...note, text }));
  };

  const close = () => {
    route(`/notes/${parentId}`);
  };

  const handleSave = () => {
    saveNote(note, parentId);
    close();
  };

  return (
    <div className={styles.main}>
      <div>{`EDIT ${id}, ${parentId}`}</div>
      <textarea
        autoFocus
        className={styles.textarea}
        value={note.text}
        onInput={(e) => handleTextChange(e.target.value)}
      />
      <div>
        <button disabled={!isComplete} onClick={handleSave}>
          Save
        </button>
        <button onClick={close}>
          Cancel
        </button>
      </div>
    </div>
  );
}
