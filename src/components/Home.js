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

// ??? switch to menu id
// ??? menu options: delete note & X children, move down a level, move up a level, move to first, edit children, edit
// ??? add actions file
// ??? click note: edit or open if children
// ??? parent note stays at the top
// ??? add child count on bottom-right
// ??? add font, PT Sans
// ??? add export
// ??? add import
// ??? save and restore scroll y by parentId
// ??? pick initial colors
// ??? color hcl editor
export default function Home() {
  const [notes, setNotes] = useLocalStorage('nNotes', defaultNotes);
  const [parentId, setParentId] = useLocalStorage('nParentId', 'root');
  const [menuShown, setMenuShown] = useState(false);

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
    // ??? implement, if parentId
    console.log('UP');
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

  const openMenu = () => {
    // ??? implement
    console.log('MENU');
    setMenuShown(true);
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
          openMenu={() => setMenuShown(true)} 
        />
        <Redirect default to="/notes/root" />
      </Router>
      <Menu
        shown={menuShown}
        onClose={() => setMenuShown(false)}
      />
    </>
  );
}
