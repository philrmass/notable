import { useState } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { createHashHistory } from 'history';
import { v4 as uuidv4 } from 'uuid';
import { move } from 'utilities/array';
import { useLocalStorage } from 'utilities/hooks';
import Edit from './Edit';
import Menu from './Menu';
import Notes from './Notes';
import Redirect from './Redirect';

const defaultNotes = {
  root: {
    children: [],
    id: 'root',
  },
};

// ??? parent fixed at top, highlighted
// ??? click note: edit or open if children
// ??? fix init color
// ??? implement move up
// ??? implement all other actions
// ??? add actions file
// ??? add child count on bottom-right
// ??? add icons (plus, up, menu/dots)
// ??? confirm if deleting note with children
// ??? add move down children names modal
// ??? add font, PT Sans
// ??? add export
// ??? add import
// ??? save and restore scroll y by parentId
// ??? pick initial colors
// ??? color hcl editor
export default function Home() {
  const rootName = 'root';
  const [notes, setNotes] = useLocalStorage('nNotes', defaultNotes);
  const [parentId, setParentId] = useLocalStorage('nParentId', rootName);
  const [menuId, setMenuId] = useState(null);
  const hasParent = parentId !== rootName;

  const addNote = (pid) => {
    const id = uuidv4();
    setParentId(pid);
    route(`/notes/${id}/edit`);
  };

  const deleteNote = (id) => {
    setNotes((lastNotes) => {
      const parent = lastNotes[parentId];
      const children = parent.children.filter((childId) => childId !== id);
      const nextNotes = Object.entries(lastNotes).reduce((all, [key, value]) => {
        if (key !== id) {
          return {
            ...all,
            [key]: value,
          };
        }
        return all;
      }, {});

      return {
        ...nextNotes,
        [parentId]: {
          ...parent,
          children,
        },
      };
    });
  };

  const goUp = () => {
    // ??? implement, if hasParent
    console.log('UP');
  };

  const moveDown = (id) => {
    // ??? implement
    console.log('MOVE-DOWN', id, 'pick child next');
  };

  const moveFirst = (id) => {
    // ??? implement
    console.log('MOVE-FIRST', id);
  };

  const moveNote = (id, toId) => {
    const parent = notes[parentId];
    const children = parent.children;
    const index = children.findIndex((child) => child === id);
    const toIndex = children.findIndex((child) => child === toId);

    setNotes((lastNotes) => ({
      ...lastNotes,
      [parentId]: {
        ...parent,
        children: move(children, index, toIndex),
      },
    }));
  };

  const moveUp = (id) => {
    // ??? implement, if hasParent
    console.log('MOVE-DOWN', id, 'pick child next');
  };

  const saveNote = (note, pid) => {
    setNotes((lastNotes) => {
      const parent = lastNotes[pid];
      const isNew = parent.children.findIndex((id) => id === note.id) === -1;
      const children = isNew ? [...parent.children, note.id] : parent.children;

      return {
        ...lastNotes,
        [note.id]: {
          ...note,
          parentId: pid,
        },
        [pid]: {
          ...parent,
          children,
        },
      };
    });
  };

  return (
    <>
      <Router history={createHashHistory()}>
        <Edit
          path="/notes/:id/edit"
          notes={notes}
          parentId={parentId}
          saveNote={(n, pid) => saveNote(n, pid)}
        />
        <Notes
          path="/notes/:id"
          notes={notes}
          addNote={addNote}
          deleteNote={deleteNote} 
          goUp={goUp}
          moveNote={moveNote}
          openMenu={(id) => setMenuId(id)} 
        />
        <Redirect default to="/notes/root" />
      </Router>
      <Menu
        id={menuId}
        hasParent={hasParent}
        deleteNote={deleteNote}
        goTo={(path) => route(path)}
        moveDown={moveDown}
        moveFirst={moveFirst}
        moveUp={moveUp}
        onClose={() => setMenuId(null)}
      />
    </>
  );
}
