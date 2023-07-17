// import { useEffect, useState } from 'preact/hooks';
import { Link, route } from 'preact-router';
import { version } from '../../package.json';
import styles from './Notes.module.css';

// ??? edit save
// ??? edit moves to the top when keyboard opens, colors shown
// ??? add top menu
// ??? add export
// ??? add import
// ??? redirect home if note not found
    //"react-dnd": "^16.0.1",
    //"react-dnd-touch-backend": "^16.0.1",
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
          { children.map((child) => (
            <Link key={child.id} href={`/notes/${child.id}/edit`}>
              <div className={styles.note}>
                { child.text }
              </div>
            </Link>
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
