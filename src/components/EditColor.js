import { useState } from 'preact/hooks';
// import classnames from 'classnames';
import { route } from 'preact-router';
// import { useLocalStorage } from 'utilities/hooks';
import {
  getMovePercentages,
  getTouches,
} from '../utilities/touch';
import Colors from './Colors';
import styles from './EditColor.module.css';

// ??? parse color into lightness, chroma, hue, useState
// ??? cursor movement changes color
// ??? getDisplayColors(l, c, h, xAxis, yAxis);
// ??? add clickable axes, click switches to other possible
// ??? display lch value in upper right
export default function EditColor() {
  // const [_, setColors] = useLocalStorage('nColors', []);
  const [index, setIndex] = useState(null);
  const [touches, setTouches] = useState([]);
  // ??? 3 components, 2 axes

  const handleColorSelect = (color, index) => {
    // ??? parseColor(color);
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
    setTouches(nextTouches);
    console.log(` move (${nextTouches[0]?.x}, ${nextTouches[0]?.y})`);
    const { dx, dy } = getMovePercentages(touches, nextTouches);
    console.log(` dx/dy (${dx}, ${dy})`);
  }

  const renderEditor = () => {
    const style1 = {}; // borderColor: '#888' };
    const style2 = {}; //  borderColor: '#888' };
    const style0 = { background: null ?? 'var(--grey2)' };

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
