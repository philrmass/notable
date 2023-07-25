import { Link, route } from 'preact-router';
import Note from './Note';
import { version } from '../../package.json';
import styles from './Notes.module.css';

export default function Notes({ id, notes, addNote, moveNote }) {
  const note = notes[id];
  const children = note.children.map((id) => notes[id]);

  if (!note) {
    route('/notes/root', true);
  }

  return (
    <div className={styles.main}>
      <div>{`NOTE ${id} [${note.children.length}]`}</div>
      { note.text && (
        <div className={styles.parent}>
          <div>{note.text}</div>
        </div>
      )}
      <div className={styles.content}>
        <div>
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
        <button>^</button>
        <Link href="/notes/root">
          Notable
          <span className={styles.version}>
            {`v${version}`}
          </span>
        </Link>
        <button onClick={() => addNote(id)}>
          +
        </button>
      </div>
    </div>
  );
}
