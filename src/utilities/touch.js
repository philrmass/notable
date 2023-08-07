export function getTouches(e) {
  const h = e.target.clientHeight;
  const w = e.target.clientWidth;

  return [...e.touches].map((touch) => ({
    id: touch.identifier,
    h,
    w,
    x: touch.clientX,
    y: touch.clientY,
  }));
}

export function getMovePercentages(lastTouches, touches) {
  const dx = 0;
  const dy = 0;

  return { dx, dy };
}

/*
function getMoveX(lasts, nows) {
  const w = nows[0].w;
  const diffs = getDiffs(lasts, nows);
  const dx = getAverage(diffs);

  return (dx / w);
}

function getDiffs(lasts, nows) {
  return nows.reduce((diffs, now) => {
    const match = lasts.find((last) => last.id === now.id);
    if (match) {
      const diff = now.x - match.x;
      return [...diffs, diff];
    }
    return diffs;
  }, []);
}

function getAverage(diffs) {
  if (diffs.length > 0) {
    const sum = diffs.reduce((sum, diff) => sum + diff, 0);
    return sum / diffs.length;
  }
  return 0;
}
*/
