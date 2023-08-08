import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
// import { useLocalStorage } from 'utilities/hooks';
import { parseLch } from '../utilities/color';
import { getMovePercentages, getTouches } from '../utilities/touch';
import Colors from './Colors';
import styles from './EditColor.module.css';

// ??? add clickable axes, click switches to other possible
// ??? display lch value in upper right
export default function EditColor() {
  // const [_, setColors] = useLocalStorage('nColors', []);
  const [index, setIndex] = useState(null);
  const [touches, setTouches] = useState([]);
  const [lch, setLch] = useState({ l: 50, c: 0, h: 0 });
  const [display, setDisplay] = useState({});

  useEffect(() => {
    const { l, c, h } = lch;
    const center = `lch(${l} ${c} ${h})`;
    // ???? getDisplayColors(lch, xAxis, yAxis);
    console.log('calcColors', center);
    setDisplay({ center });
  }, [lch]);

  const handleColorSelect = (color, index) => {
    setLch(parseLch(color)); 
    setIndex(index);
  };

  const handleMouseMove = (e) => {
    console.log('move', e);
  };

  const handleSave = () => {
    console.log('save', index);
  };

  const handleCancel = () => {
    console.log('cancel');
  };

  const handleExport = () => {
    console.log('export');
  };

  const handleExit = () => {
    route('/notes/root');
  };

  function handleStart(e) {
    setTouches(getTouches(e));
  }

  function handleMove(e) {
    const nextTouches = getTouches(e);
    const { dx, dy } = getMovePercentages(touches, nextTouches);
    setTouches(nextTouches);

    // ???? update l c h via cursor movement
    console.log(` ${(100 * dx).toFixed(3)},  ${(100 * dy).toFixed(3)}`);
  }

  const renderEditor = () => {
    const style1 = {}; // borderColor: '#888' };
    const style2 = {}; //  borderColor: '#888' };
    const style0 = { background: display.center ?? 'var(--grey2)' };

    return (
      <div className={styles.color2} style={style2}
        onMouseMove={(e) => handleMouseMove(e)}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
      >
        <div className={styles.color1} style={style1}>
          <div className={styles.color0} style={style0}>
            EDITOR
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.colors}>
        <Colors
          color={null}
          onSelect={handleColorSelect}
        />
      </div>
      { renderEditor() }
      <div className={styles.buttons}>
        <button
          className="button"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="button"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="button"
          onClick={handleExport}
        >
          Export
        </button>
        <button
          className="button"
          onClick={handleExit}
        >
          Exit
        </button>
      </div>
    </div>
  );
}
