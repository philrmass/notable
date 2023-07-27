import { Link, route } from 'preact-router';
import Note from './Note';
import { version } from '../../package.json';
import styles from './Notes.module.css';

export default function Notes({
  id,
  notes,
  addNote,
  deleteNote,
  goUp,
  moveNote,
  openMenu,
}) {
  const note = notes[id];
  const children = note.children.map((id) => notes[id]);

  if (!note) {
    route('/notes/root', true);
  }

  return (
    <div className={styles.main}>
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
              deleteNote={deleteNote} 
              moveNote={moveNote}
              openMenu={openMenu} 
            />
          )) }
        </div>
      </div>
      <div className={styles.footer}>
        <button
          className="icon-button"
          onClick={() => addNote(id)}
        >
          +
        </button>
        <Link href="/notes/root">
          Notable
          <span className={styles.version}>
            {`v${version}`}
          </span>
        </Link>
        <button
          className="icon-button"
          onClick={() => goUp()}
        >
          ^
        </button>
      </div>
    </div>
  );
}
