import { Link, route } from 'preact-router';
import Icon from 'utilities/Icon';
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
  const hasParent = Boolean(note.parentId);

  if (!note) {
    route('/notes/root', true);
  }

  return (
    <>
      <div className={styles.main}>
        { note.text && (
          <div className={styles.parent}>
            <Note
              key={note.id}
              {...note}
              isParent={true}
              deleteNote={deleteNote} 
              moveNote={moveNote}
              openMenu={openMenu} 
            />
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
            onClick={() => addNote()}
          >
            <Icon name="plus" className="icon" />
          </button>
          <Link href="/notes/root">
            Notable
            <span className={styles.version}>
              {`v${version}`}
            </span>
          </Link>
          <button
            className="icon-button"
            disabled={!hasParent}
            onClick={() => goUp()}
          >
            <Icon name="up" className="icon" />
          </button>
        </div>
      </div>
    </>
  );
}
