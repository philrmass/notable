export function parseNotes(data) {
  const isObject = data && typeof data === 'object';
  const hasRoot = Boolean(data?.root);

  if (!isObject) {
    return { error: 'Data is not an object' };
  }

  if (!hasRoot) {
    return { error: 'No root note found' };
  }

  const linkedIds = findChildIds(data, 'root');
  const linkedObj = linkedIds.reduce((obj, id) => ({ ...obj, [id]: true }), {});
  const allIds = Object.keys(data);
  const unlinkedIds = allIds.filter((id) => !linkedObj[id]); 
  const notes = importNotes(data, 'root');

  if (unlinkedIds.length > 0) {
    const root = notes.root;
    const unlinked = unlinkedIds.reduce((all, id) => ({
      [id]: data[id],
    }), {});

    return {
      ...notes,
      root: {
        ...root,
        children: [...root.children, ...unlinkedIds],
      },
      ...unlinked,
    };
  }

  return { notes };
}

export function importNotes(data, id, parentId = null, notes = {}) {
  const note = data[id];
  const children = note.children.filter((id) => data[id]);
  const childNotes = children.reduce((all, childId) => ({
    ...all,
    ...importNotes(data, childId, id),
  }), {});

  return {
    ...notes,
    ...childNotes,
    [id]: {
      at: note.at,
      children,
      color: note.color,
      id,
      parentId,
      text: note.text,
    },
  };
}

export function addNotes(notes, addedNotes) {
  const root = notes.root;
  const addedChildren = addedNotes.root.children;
  const addedExceptRoot = Object.keys(addedNotes).reduce((all, id) => {
    if (id !== 'root') {
      return {
        ...all,
        [id]: addedNotes[id],
      };
    }
    return all;
  }, {});

  return {
    ...notes,
    ...addedExceptRoot,
    root: {
      ...root,
      children: [...root.children, ...addedChildren],
    },
  };
}

export function findChildIds(notes, id, childIds = []) {
  const note = notes[id];
  const ids = note?.children?.map((childId) => findChildIds(notes, childId)) ?? [];

  return childIds.concat(id, ...ids);
}

export function getLastAt(notes) {
  return Object.values(notes).reduce((lastAt, note) => (
    note.at > lastAt ? note.at : lastAt
  ), 0);
}

export function getSaveFilePath(at = Date.now()) {
  const when = new Date(at);
  const year = when.getFullYear();
  const month = `${when.getMonth() + 1}`.padStart(2, '0');
  const date = `${when.getDate()}`.padStart(2, '0');

  return `notes_${year}_${month}_${date}.json`;
}
