import { Link } from 'preact-router';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
import Handle from './Handle';
import styles from './Note.module.css';

export default function Note({ id, color, text, moveNote }) {
  const type = 'Note';

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
      ref={drop}
      style={noteStyles}
      className={noteClasses}
    >
      <div className="controls">
        <button>M</button>
        <div>3</div>
      </div>
      <div className="text">
        <Link key={id} href={`/notes/${id}/edit`}>
          <div className={styles.link}>
            { text }
          </div>
        </Link>
      </div>
      <div ref={drag} className="handle">
        <Handle />
      </div>
    </div>
  );
}
