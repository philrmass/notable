import { Link } from 'preact-router';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
import Icon from 'utilities/Icon';
import Handle from './Handle';
import styles from './Note.module.css';

export default function Note({
  id,
  children,
  color,
  text,
  isParent = false,
  deleteNote,
  moveNote,
  openMenu,
}) {
  const type = 'Note';
  const childCount = children?.length ?? 0;
  const showEdit = isParent || childCount === 0;
  const url = `/notes/${id}${showEdit ? '/edit' : ''}`;

  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, color, text },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), []);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (item.id !== id) {
        moveNote(item.id, id);
      }
    },
  });

  const noteStyles = { background: color };
  const noteClasses = classnames('note', { [styles.hidden]: isDragging });

  return (
    <div
      ref={!isParent && drop}
      style={noteStyles}
      className={noteClasses}
    >
      <div className="controls">
        { !isParent && (
          <>
            <button
              className="icon-button"
              onClick={() => openMenu(id)}
            >
              <Icon name="menu" className="icon" />
            </button>
            <button
              className="icon-button"
              onClick={() => deleteNote(id)}
            >
              <Icon name="cross" className="icon" />
            </button>
          </>
        ) }
      </div>
      <div className="text">
        <Link key={id} href={url}>
          <div className={styles.link}>
            { text }
            { !isParent && childCount > 0 && (
              <div className={styles.count}>
                { childCount }
              </div>
            ) }
          </div>
        </Link>
      </div>
      <div ref={!isParent && drag} className="handle">
        <Handle />
      </div>
    </div>
  );
}
