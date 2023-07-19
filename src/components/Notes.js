// import { useEffect, useState } from 'preact/hooks';
import { Link, route } from 'preact-router';
import Note from './Note';
import { version } from '../../package.json';
import styles from './Notes.module.css';

// ??? edit moves to the top when keyboard opens, colors shown
// ??? add export
// ??? add import
export default function Notes({ id, notes, addNote }) {
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
          { children.map((child) => <Note key={child.id} {...child} />) }
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
