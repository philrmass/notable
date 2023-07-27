import { useEffect, useState } from 'preact/hooks';
import classnames from 'classnames';
import { route } from 'preact-router';
import Colors from './Colors';
import Handle from './Handle';
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
  const [keyboard, setKeyboard] = useState(false);
  const isComplete = Boolean(note.text);

  useEffect(() => {
    const existing = notes[id];
    if (existing) {
      setNote(existing);
    } else {
      // ??? use existing color, parent color, last color, default
      const color = '#80c0ff';
      setNote(getDefaultNote(id, color));
    }
  }, [notes, id]);

  const handleColorChange = (color) => {
    setNote((note) => ({ ...note, color }));
  };

  const handleTextChange = (text) => {
    setNote((note) => ({ ...note, text }));
  };

  const close = () => {
    route(`/notes/${parentId}`);
  };

  const handleSave = () => {
    saveNote(note, parentId);
    close();
  };

  const noteStyles = { background: note.color };
  const textClasses = classnames('text', styles.text);

  return (
    <div className={styles.main}>
      <div className={styles.top} />
      <div className={styles.colors}>
        <Colors
          color={note.color}
          onColorSelect={handleColorChange}
        />
      </div>
      <div style={noteStyles} className="note">
        <div className="controls" />
        <textarea
          autoFocus
          className={textClasses}
          value={note.text}
          onInput={(e) => handleTextChange(e.target.value)}
          onBlur={() => setKeyboard(false)}
          onFocus={() => setKeyboard(true)}
        />
        <Handle />
      </div>
      <div className={styles.buttons}>
        <button
          className="button"
          disabled={!isComplete}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="button"
          onClick={close}
        >
          Cancel
        </button>
      </div>
      <div>{ keyboard ? 'keyboard' : 'no keyboard' }</div>
      <div className={styles.bottom} />
    </div>
  );
}
