import { Link } from 'preact-router';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
import Handle from './Handle';
import styles from './Note.module.css';

export default function Note({ id, text, moveNote }) {
  const type = 'Note';
  const color = '#ff0000';

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

  const noteClasses = classnames('note', { hidden: isDragging });

  return (
    <div ref={drop} className={noteClasses}>
      <div className="controls">
        <button>M</button>
        <div>3</div>
      </div>
      <div className="text">
        <Link key={id} href={`/notes/${id}/edit`}>
          <div className={styles.link}>
            { `(${id.slice(-4)}) ${text}` }
          </div>
        </Link>
      </div>
      <div ref={drag} className="handle">
        <Handle />
      </div>
    </div>
  );
}
