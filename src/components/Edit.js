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
/*
import { useState } from 'preact/hooks';
import { useDispatch } from 'react-redux';
import cln from 'classnames';
import { editNote, selectNote } from '../redux/uiActions';
import styles from './NoteText.module.css';

export default function NoteText({ id, text, setText }) {
  const [start, setStart] = useState(0);
  const [_, setTimer] = useState(null);
  const [y, setY] = useState(null);
  const [moveY, setMoveY] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const dis = useDispatch();
  const isEditing = Boolean(setText);
  const shortPressMs = 200;
  const longPressMs = 500;
  const moveMax = 20;

  const handleStart = (e) => {
    const ey = e.clientY ?? e.touches[0].clientY;

    setStart(Date.now());
    setY(ey);
    setMoveY(0);
    setTimer((timerId) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      return setTimeout(() => setIsOpening(true), longPressMs);
    });
  };

  const handleEnd = (e) => {
    const time = Date.now() - start;

    e.preventDefault();
    setTimer((timerId) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      return null;
    });

    if (time < shortPressMs && moveY <= moveMax) {
      setTimeout(() => dis(selectNote(id)), 0);
    }
  };

  const handleMove = (e) => {
    const ey = e.clientY ?? e.touches[0].clientY;
    const dy = Math.abs(ey - y);
    setMoveY(dy);

    if (dy > moveMax) {
      setTimer((timerId) => {
        if (timerId) {
          clearTimeout(timerId);
        }
        return null;
      });
    }
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    );
  }

  const textStyles = cln({
    [styles.text]: true,
    [styles.opening]: isOpening,
  });

  return (
    <div
      className={textStyles}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      onTouchMove={handleMove}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseMove={handleMove}
      onTransitionEnd={() => dis(editNote(id))}
    >
      {text}
    </div>
  );
}
*/
