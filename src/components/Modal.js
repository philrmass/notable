import { useEffect, useRef } from 'preact/hooks';
import Icon from 'utilities/Icon';
import styles from './Modal.module.css';

export default function Modal({
  children,
  onClose,
  shown,
}) {
  const dialogRef = useRef();

  useEffect(() => {
    if (shown) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [shown, onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
    >
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.top}>
            <button
              className={styles.close}
              onClick={onClose}
            >
              <Icon name="cross" className={styles.icon} />
            </button>
          </div>
          <div className={styles.children}>
            { children }
          </div>
        </div>
      </div>
    </dialog>
  );
}
