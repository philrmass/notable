import { useEffect, useState } from 'preact/hooks';
import classnames from 'classnames';
import { Link, route } from 'preact-router';
import { useLocalStorage } from 'utilities/hooks';
import Icon from 'utilities/Icon';
import Colors from './Colors';
import Handle from './Handle';
import styles from './Edit.module.css';

function getDefaultNote(id, parentId, color) {
  return {
    at: Date.now(),
    children: [],
    color,
    id,
    parentId,
    text: '',
  };
}

export default function Edit({
  colors,
  id,
  notes,
  parentId,
  saveNote,
}) {
  const defaultColor = 'var(--note-default)';
  const existing = notes[id];
  const [lastColor, setLastColor] = useLocalStorage('nLastColor', defaultColor);
  const [lastToFirst, setLastToFirst] = useLocalStorage('nLastToFirst', null);
  const [note, setNote] = useState(existing);
  const [toFirst, setToFirst] = useState(null);
  const [scrollId, setScrollId] = useState();
  const hasToFirst = typeof toFirst === 'boolean';
  const showFirst = toFirst || !hasToFirst;

  useEffect(() => {
    if (!existing) {
      setToFirst(lastToFirst);
    }
  }, [id, existing, lastToFirst]);

  useEffect(() => {
    if (existing) {
      setNote(existing);
    }
  }, [existing]);

  useEffect(() => {
    if (!existing && !note) {
      const parentColor = notes[parentId]?.color;
      const color = parentColor ?? lastColor;

      setNote(getDefaultNote(id, parentId, color));
      setScrollId(id);
    }
  }, [existing, notes, parentId, id, note, lastColor]);

  const handleColorChange = (color) => {
    setLastColor(color);
    setNote((note) => ({ ...note, color }));
  };

  const handleTextChange = (text) => {
    setNote((note) => ({ ...note, text }));
  };

  const handleToFirstChange = () => {
    if (hasToFirst) {
      const value = !toFirst;
      setToFirst(value);
      setLastToFirst(value);
    } else {
      setToFirst(showFirst);
      setLastToFirst(showFirst);
    }
  };

  const close = () => {
    setNote(null);
    route(`/notes/${parentId}`);
  };

  const handleSave = () => {
    const sid = scrollId ?? (hasToFirst && note.id);

    setNote(null);
    saveNote(note, toFirst, sid);
    close();
  };

  const text = note?.text ?? '';
  const color = note?.color ?? '';
  const isComplete = Boolean(text);
  const noteStyles = { background: color };
  const textClasses = classnames('text', styles.text);
  const buttonClasses = classnames(
    styles.large,
    'icon-button', 
    { [styles.unset]: !hasToFirst },
  );
  const iconName = showFirst ? 'caretUp' : 'caretDown';

  return (
    <div className={styles.main}>
      <div
        className={styles.top}
        onClick={() => route('/colors')}
      />
      { existing && (
        <Link className={styles.link} href={`/notes/${id}`}>
          Edit Children
        </Link>
      ) }
      <div className={styles.colors}>
        <Colors
          colors={colors}
          selected={color}
          onSelect={handleColorChange}
        />
      </div>
      <div style={noteStyles} className="note">
        <div className={`controls ${styles.controls}`}>
          <button
            className={buttonClasses}
            onClick={handleToFirstChange}
          >
            <Icon name={iconName} className="icon" />
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
