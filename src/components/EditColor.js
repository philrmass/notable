import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
// import { useLocalStorage } from 'utilities/hooks';
import {
  applyLchLimits,
  parseLch,
  toLchStr,
} from '../utilities/color';
import { getMoveRatios, getTouches } from 'utilities/touch';
import Colors from './Colors';
import styles from './EditColor.module.css';

// ??? add clickable axes, click switches to other possible
// ??? save color to local storage
// ??? cancel back to start index color
// ??? export colors to json file
function getAxis(lchKey, moveKey) {
  const sign = { x: 1, y: -1 };
  const mults = { l: 10, c: 20, h: -40 };
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

function getDisplayColors(lch, xAxis, yAxis) {
  const deltaBase = 0.2;
  const indicies = [0, 1, 2];
  const signs = [1, -1];
  const axes = [xAxis, yAxis];

  const center = ['center', toLchStr(lch)];
  const entries = indicies.reduce((all0, index) => {
    const delta = (index + 1) * deltaBase;

    const entries0 = signs.reduce((all1, sign) => {
      const move = {
        x: sign * delta,
        y: sign * -delta,
      };

      const entries1 = axes.map((axis) => {
        const key = `${axis.moveKey}${sign === -1 ? '_' : ''}${index}`;
        const value = toLchStr(adjustAxisColor(lch, move, axis));

        return [key, value];
      });

      return [...all1, ...entries1];
    }, []);

    return [...all0, ...entries0]; 
  }, [center]);

  return Object.fromEntries(entries);
}

export default function EditColor() {
  // const [_, setColors] = useLocalStorage('nColors', []);
  const [index, setIndex] = useState(null);
  const [touches, setTouches] = useState([]);
  const [lch, setLch] = useState({ l: 70, c: 0, h: 0 });
  const [display, setDisplay] = useState({});
  const [xAxis, _setXAxis] = useState(getAxis('h', 'x'));
  const [yAxis, _setYAxis] = useState(getAxis('l', 'y'));

  useEffect(() => {
    setDisplay(getDisplayColors(lch, xAxis, yAxis));
  }, [lch, xAxis, yAxis]);

  const handleColorSelect = (color, index) => {
    setLch(parseLch(color)); 
    setIndex(index);
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
    e.preventDefault();

    setTouches(getTouches(e));
  }

  function handleMove(e) {
    e.preventDefault();

    const nextTouches = getTouches(e);
    const move = getMoveRatios(touches, nextTouches);
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
