import { move } from 'utilities/array';

export function deleteChild(setNotes, parentId, id) {
  setNotes((lastNotes) => {
    const parent = lastNotes[parentId];
    const children = parent.children.filter((childId) => childId !== id);

    const ids = findChildIds(lastNotes, id);
    const remainingNotes = Object.entries(lastNotes).reduce((all, [key, value]) => {
      if (ids.includes(key)) {
        return all;
      }

      return {
        ...all,
        [key]: value,
      };
    }, {});

    return {
      ...remainingNotes,
      [parentId]: {
        ...parent,
        children,
      },
    };
  });
}

export function findChildIds(notes, id, childIds = []) {
  const note = notes[id];

  return childIds.concat(id, ...note.children.map((childId) => findChildIds(notes, childId)));
}

export function moveChild(setNotes, parentId, fromIndex, toIndex) {
  setNotes((lastNotes) => {
    const parent = lastNotes[parentId];

    return {
      ...lastNotes,
      [parentId]: {
        ...parent,
        children: move(parent.children, fromIndex, toIndex),
      },
    };
  });
}

export function moveChildUp(setNotes, parentId, id) {
  setNotes((lastNotes) => {
    const note = lastNotes[id];

    const parent = lastNotes[parentId];
    const children = parent.children;
    const index = children.findIndex((child) => child === id);

    const grandparentId = parent.parentId;
    const grandparent = lastNotes[grandparentId];
    const toChildren = grandparent.children;
    const toIndex = 1 + toChildren.findIndex((child) => child === parentId);

    return {
      ...lastNotes,
      [grandparentId]: {
        ...grandparent,
        children: [...toChildren.slice(0, toIndex), id, ...toChildren.slice(toIndex)],
      },
      [parentId]: {
        ...parent,
        children: [...children.slice(0, index), ...children.slice(index + 1)],
      },
      [id]: {
        ...note,
        parentId: grandparentId,
      },
    };
  });
}

export function updateNote(setNotes, parentId, note) {
  setNotes((lastNotes) => {
    const parent = lastNotes[parentId];
    const isNew = parent.children.findIndex((id) => id === note.id) === -1;
    const children = isNew ? [...parent.children, note.id] : parent.children;

    return {
      ...lastNotes,
      [parentId]: {
        ...parent,
        children,
      },
      [note.id]: {
        ...note,
        parentId,
      },
    };
  });
}
