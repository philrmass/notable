import { Link } from 'preact-router';
import { useDrag, useDrop } from 'react-dnd';
import styles from './Note.module.css';

function moveNote(itemId, id) {
  console.log('move', itemId.slice(-4), id.slice(-4));
}

export default function Note({ id, text }) {
  const parentId = 'hello';
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

  return (
    <div ref={drop} className={styles.note}>
      <Link key={id} href={`/notes/${id}/edit`}>
        { `(${id.slice(-4)}) ${text}` }
      </Link>
      <div ref={drag} className={styles.drag}>
        DRAG
      </div>
    </div>
  );
}
