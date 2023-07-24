// import { useEffect, useState } from 'preact/hooks';
import { Link, route } from 'preact-router';
import Note from './Note';
import { version } from '../../package.json';
import styles from './Notes.module.css';

// ??? click, edit or open if children
// ??? edit ui, move up with keyboard, show colors
// ??? add child count on note
// ??? note menu: <dialog> move to top, edit, remove, add children, move up a level
// ??? click on parent note to move up
// ??? notes menu: ???
// ??? confirm delete
// ??? add export
// ??? add import
export default function Notes({ id, notes, addNote, moveNote }) {
  const note = notes[id];
  const children = note.children.map((id) => notes[id]);
  console.log('children', children);

  if (!note) {
    route('/notes/root', true);
  }
  console.log('note', notes[id]);

  return (
    <div className={styles.main}>
      <div>{`NOTE ${id} [${note.children.length}]`}</div>
      { note.text && (
        <div className={styles.parent}>
          <div>{note.text}</div>
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.notes}>
          { children.map((child) => (
            <Note
              key={child.id}
              {...child}
              moveNote={moveNote}
            />
          )) }
        </div>
      </div>
      <div className={styles.footer}>
        <button onClick={() => addNote(id)}>
          +
        </button>
        <Link href="/notes/root">
          Notable
          <span className={styles.version}>
            {`v${version}`}
          </span>
        </Link>
        <button>M</button>
      </div>
    </div>
  );
}
