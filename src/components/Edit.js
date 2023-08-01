import { useEffect, useState } from 'preact/hooks';
import classnames from 'classnames';
import { route } from 'preact-router';
import { useLocalStorage } from 'utilities/hooks';
import Icon from 'utilities/Icon';
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
  const defaultColor = 'var(--note-default)';
  const [lastColor, setLastColor] = useLocalStorage('nLastColor', defaultColor);
  const [note, setNote] = useState(notes[id]);
  const [toFirst, setToFirst] = useState(false);

  useEffect(() => {
    const existing = notes[id];

    if (existing) {
      setNote(existing);
    }
  }, [notes, id]);

  useEffect(() => {
    if (!notes[id] && !note) {
      const parentColor = notes[parentId]?.color;
      const color = parentColor ?? lastColor;

      setNote(getDefaultNote(id, color));
    }
  }, [notes, parentId, id, note, lastColor]);

  const handleColorChange = (color) => {
    setLastColor(color);
    setNote((note) => ({ ...note, color }));
  };

  const handleTextChange = (text) => {
    setNote((note) => ({ ...note, text }));
  };

  const close = () => {
    setNote(null);
    route(`/notes/${parentId}`);
  };

  const handleSave = () => {
    setNote(null);
    saveNote(note, toFirst);
    close();
  };

  const text = note?.text ?? '';
  const color = note?.color ?? '';
  const isComplete = Boolean(text);
  const noteStyles = { background: color };
  const textClasses = classnames('text', styles.text);

  return (
    <div className={styles.main}>
      <div className={styles.top} />
      <div className={styles.colors}>
        <Colors
          color={color}
          onColorSelect={handleColorChange}
        />
      </div>
      <div style={noteStyles} className="note">
        <div className="controls">
          <button
            disabled={toFirst}
            className="icon-button"
            onClick={() => setToFirst(true)}
          >
            <Icon name="caretUp" className="icon" />
          </button>
          <button
            disabled={!toFirst}
            className="icon-button"
            onClick={() => setToFirst(false)}
          >
            <Icon name="caretDown" className="icon" />
          </button>
        </div>
        <textarea
          autoFocus
          className={textClasses}
          value={text}
          onInput={(e) => handleTextChange(e.target.value)}
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
    </div>
  );
}
