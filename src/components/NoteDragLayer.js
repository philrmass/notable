import classnames from 'classnames';
import { useDragLayer } from 'react-dnd';
import Handle from './Handle';
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

  const noteStyle = {
    background: item?.color,
    left: `${diff?.x ?? 0}px`,
    top: `${current?.y ?? 0}px`,
  };

  if (!isDragging) {
    return null;
  }

  const noteClasses = classnames('note', styles.note);
  const textClasses = classnames('text', styles.text);

  return (
    <div className={noteClasses} style={noteStyle}>
      <div className="controls">
        <button>M</button>
        <div>3</div>
      </div>
      <div className={textClasses}>
        { item.text }
      </div>
      <div className="handle">
        <Handle />
      </div>
    </div>
  );
}
