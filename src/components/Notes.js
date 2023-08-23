import { useEffect, useRef } from 'preact/hooks';
import { Link, route } from 'preact-router';
import { useLocalStorage } from 'utilities/hooks';
import Icon from 'utilities/Icon';
import Note from './Note';
import { version } from '../../package.json';
import styles from './Notes.module.css';

export default function Notes({
  id,
  notes,
  scrollId,
  addNote,
  clearScrollId,
  deleteNote,
  goUp,
  moveNote,
  openMenu,
  showTopMenu,
}) {
  const note = notes[id];
  const children = note.children.map((id) => notes[id]);
  const hasParent = Boolean(note.parentId);
  const contentRef = useRef();
  const [scrolls, setScrolls] = useLocalStorage('nScrolls', {});

  const scrollIntoView = (ref) => {
    setTimeout(() => ref.scrollIntoView(), 0);
    clearScrollId();
  };

  useEffect(() => {
    contentRef.current.scrollTop = scrolls[id];
  }, [id]); // eslint-disable-line

  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    
    setScrolls((value) => ({
      ...value,
      [id]: scrollTop,
    }));
  };

  if (!note) {
    route('/notes/root', true);
  }

  return (
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
      <div
        ref={contentRef}
        className={styles.content}
        onScroll={handleScroll}
      >
        <div className={styles.notes}>
          { children.map((child) => (
            <div
              key={child.id}
              ref={child.id === scrollId && scrollIntoView}
              className="wrap"
            >
              <Note
                key={child.id}
                {...child}
                deleteNote={deleteNote} 
                moveNote={moveNote}
                openMenu={openMenu} 
              />
            </div>
          )) }
        </div>
      </div>
      <div className={styles.footer}>
        { !hasParent && (
          <button
            className="icon-button"
            onClick={() => showTopMenu()}
          >
            <Icon name="menu" className="icon" />
          </button>
        ) }
        { hasParent && (
          <button
            className="icon-button"
            disabled={!hasParent}
            onClick={() => goUp()}
          >
            <Icon name="up" className="icon" />
          </button>
        ) }
        <Link href="/notes/root">
          <div className={styles.link}>
            <img
              src="./assets/icon.png"
              className={styles.icon}
            />
            <div className={styles.name}>
              Notable
              <div className={styles.version}>
                {`v${version}`}
              </div>
            </div>
          </div>
        </Link>
        <button
          className="icon-button"
          onClick={() => addNote()}
        >
          <Icon name="plus" className="icon" />
        </button>
      </div>
    </div>
  );
}
