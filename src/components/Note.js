import { Link } from 'preact-router';
import { useDrag, useDrop } from 'react-dnd';
import classnames from 'classnames';
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

  const classes = classnames(
    styles.note,
    { [styles.hidden]: isDragging },
  );

  return (
    <div ref={drop} className={classes}>
      <Link key={id} href={`/notes/${id}/edit`}>
        { `(${id.slice(-4)}) ${text}` }
      </Link>
      <div ref={drag} className={styles.handle}>
        DRAG
      </div>
    </div>
  );
}
