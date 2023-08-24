import { useEffect, useState } from 'preact/hooks';
import { route } from 'preact-router';
import {
  applyLchLimits,
  getSaveFilePath,
  parseLch,
  toLchStr,
} from '../utilities/color';
import { loadJsonFile, saveJsonFile } from 'utilities/file';
import { getMoveRatios, getTouches } from 'utilities/touch';
import Colors from './Colors';
import styles from './EditColor.module.css';

function getAxis(lchKey, moveKey) {
  const sign = { x: 1, y: -1 };
  const mults = { l: 10, c: 20, h: 40 };
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

export default function EditColor({
  colors,
  resetColors,
  setColors,
}) {
  const [index, setIndex] = useState(null);
  const [touches, setTouches] = useState([]);
  const [lch, setLch] = useState({ l: 70, c: 0, h: 0 });
  const [display, setDisplay] = useState({});
  const [xAxis, setXAxis] = useState(getAxis('h', 'x'));
  const [yAxis, setYAxis] = useState(getAxis('l', 'y'));

  useEffect(() => {
    setDisplay(getDisplayColors(lch, xAxis, yAxis));
  }, [lch, xAxis, yAxis]);

  const handleColorSelect = (color, index) => {
    setLch(parseLch(color)); 
    setIndex(index);
  };

  const handleSave = () => {
    const before = colors.slice(0, index);
    const after = colors.slice(index + 1);

    setColors([...before, toLchStr(lch, 4), ...after]);
  };

  const handleCancel = () => {
    setLch(parseLch(colors[index])); 
  };

  const handleExport = () => {
    saveJsonFile(getSaveFilePath(), colors);
  };

  const handleExit = () => {
    route('/notes/root');
  };

  const handleImport = async () => {
    const data = await loadJsonFile();
    setColors(data);
  };

  const handleStart = (e) => {
    e.preventDefault();

    setTouches(getTouches(e));
  };

  const handleMove = (e) => {
    e.preventDefault();

    const nextTouches = getTouches(e);
    const move = getMoveRatios(touches, nextTouches);
    setTouches(nextTouches);
    setLch(adjustColor(lch, move, xAxis, yAxis));
  };

  const renderAxis = (axis, otherAxis, onAxisChange) => {
    const names = {
      h: 'Hue',
      c: 'Chroma',
      l: 'Lightness',
    };

    const handleClick = () => {
      const lchKey = Object.keys(names).find((key) => (
        key !== axis.lchKey && key !== otherAxis.lchKey
      ));

      onAxisChange(getAxis(lchKey, axis.moveKey));
    };

    return (
      <div
        className={`${styles.axis} ${styles[axis.moveKey]}`}
        onClick={handleClick}
      >
        {names[axis.lchKey]}
      </div>
    );
  };

  const renderButton = (label, handler) => (
    <button className="button" onClick={handler}>
      { label }
    </button>
  );

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
      <div className={styles.editor}>
        { renderAxis(yAxis, xAxis, (axis) => setYAxis(axis)) }
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
        <div className={styles.corner} />
        { renderAxis(xAxis, yAxis, (axis) => setXAxis(axis)) }
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.colors}>
        <Colors
          colors={colors}
          onSelect={handleColorSelect}
        />
      </div>
      { renderEditor() }
      <div className={styles.buttons}>
        { renderButton('Save', handleSave) }
        { renderButton('Cancel', handleCancel) }
        { renderButton('Reset', resetColors) }
        { renderButton('Import', handleImport) }
        { renderButton('Export', handleExport) }
        { renderButton('Exit', handleExit) }
      </div>
    </div>
  );
}
