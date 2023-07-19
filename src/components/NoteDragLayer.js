import { useDragLayer } from 'react-dnd';
import styles from './NoteDragLayer.module.css';

export default function NoteDragLayer() {
  const { isDragging, item, current, diff } = useDragLayer(
    monitor => ({
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
      current: monitor.getSourceClientOffset(),
      diff: monitor.getDifferenceFromInitialOffset(),
    }),
  );

  // ??? restore
  // const background = item.color ?? '#ffffff';
  const left = `${diff?.x ?? 0}px`;
  const top = `${current?.y ?? 0}px`;

  const noteStyle = {
    //background,
    left,
    top,
  };

  if (!isDragging) {
    return null;
  }

  return (
    <div className={styles.note} style={noteStyle}>
      { `(${item.id.slice(-4)}) ${item.text}` }
    </div>
  );
}
