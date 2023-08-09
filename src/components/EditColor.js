import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
// import { useLocalStorage } from 'utilities/hooks';
import {
  applyLchLimits,
  parseLch,
  toLchStr,
} from '../utilities/color';
import { getMovePercentages, getTouches } from '../utilities/touch';
import Colors from './Colors';
import styles from './EditColor.module.css';

// ??? add clickable axes, click switches to other possible
function getAxis(lchKey, moveKey) {
  const sign = { dx: 1, dy: -1 };
  const mults = {
    l: 10,
    c: 20,
    h: 40,
  };
  const mult = sign[moveKey] * mults[lchKey];

  return { lchKey, moveKey, mult };
}

function adjustAxisColor(lch, move, axis) {
  const component = lch[axis.lchKey];
  const diff = move[axis.moveKey];
  const updated = component + axis.mult * diff;

  return {
    ...lch,
    [axis.lchKey]: updated,
  };
}

function adjustColor(lch, move, xAxis, yAxis) {
  const lchX = adjustAxisColor(lch, move, xAxis);
  const lchY = adjustAxisColor(lchX, move, yAxis);

  return applyLchLimits(lchY);
}

// ???? redo
function getDisplayColors(lch, xAxis, yAxis) {
  const d = 0.2;
  const d0 = d;
  const d1 = 2 * d;
  const d2 = 3 * d;
  const move0 = { dx: d0, dy: -d0 };
  const move1 = { dx: d1, dy: -d1 };
  const move2 = { dx: d2, dy: -d2 };
  const move_0 = { dx: -d0, dy: d0 };
  const move_1 = { dx: -d1, dy: d1 };
  const move_2 = { dx: -d2, dy: d2 };

  const center = toLchStr(lch);
  const x0 = toLchStr(adjustAxisColor(lch, move0, xAxis));
  const y0 = toLchStr(adjustAxisColor(lch, move0, yAxis));
  const x1 = toLchStr(adjustAxisColor(lch, move1, xAxis));
  const y1 = toLchStr(adjustAxisColor(lch, move1, yAxis));
  const x2 = toLchStr(adjustAxisColor(lch, move2, xAxis));
  const y2 = toLchStr(adjustAxisColor(lch, move2, yAxis));
  const x_0 = toLchStr(adjustAxisColor(lch, move_0, xAxis));
  const y_0 = toLchStr(adjustAxisColor(lch, move_0, yAxis));
  const x_1 = toLchStr(adjustAxisColor(lch, move_1, xAxis));
  const y_1 = toLchStr(adjustAxisColor(lch, move_1, yAxis));
  const x_2 = toLchStr(adjustAxisColor(lch, move_2, xAxis));
  const y_2 = toLchStr(adjustAxisColor(lch, move_2, yAxis));

  return { center, x0, y0, x1, y1, x2, y2, x_0, y_0, x_1, y_1, x_2, y_2 };
}

export default function EditColor() {
  // const [_, setColors] = useLocalStorage('nColors', []);
  const [index, setIndex] = useState(null);
  const [touches, setTouches] = useState([]);
  const [lch, setLch] = useState({ l: 70, c: 0, h: 0 });
  const [display, setDisplay] = useState({});
  const [xAxis, _setXAxis] = useState(getAxis('h', 'dx'));
  const [yAxis, _setYAxis] = useState(getAxis('l', 'dy'));

  useEffect(() => {
    setDisplay(getDisplayColors(lch, xAxis, yAxis));
  }, [lch, xAxis, yAxis]);

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
    const move = getMovePercentages(touches, nextTouches);
    setTouches(nextTouches);
    setLch(adjustColor(lch, move, xAxis, yAxis));
  }

  const renderEditor = () => {
    const styleCenter = {
      background: display.center,
    };
    const style0 = {
      borderColor: `${display.y0} ${display.x0} ${display.y_0} ${display.x_0}`,
    };
    const style1 = {
      borderColor: `${display.y1} ${display.x1} ${display.y_1} ${display.x_1}`,
    };
    const style2 = {
      borderColor: `${display.y2} ${display.x2} ${display.y_2} ${display.x_2}`,
    };

    return (
      <div className={styles.color2} style={style2}
        onMouseMove={(e) => handleMouseMove(e)}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
      >
        <div className={styles.color1} style={style1}>
          <div className={styles.color0} style={style0}>
            <div className={styles.center} style={styleCenter}>
              <div className={styles.shadow}>
                { toLchStr(lch, 1) }
                <div className={styles.value}>
                  { toLchStr(lch, 1) }
                </div>
              </div>
            </div>
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
