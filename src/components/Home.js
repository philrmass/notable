import { useState } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { createHashHistory } from 'history';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from 'utilities/hooks';
import {
  deleteChild,
  findChildIds,
  moveChild,
  moveChildUp,
  updateNote,
} from '../utilities/actions';
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

// ??? add ConfirmDelete as a Modal, deleteNote(id, false)
// ??? add icons (plus, up, menu/dots)
// ??? add move down children names modal
// ??? add font, PT Sans
// ??? add export
// ??? add import
// ??? save and restore scroll y by parentId
// ??? pick set of colors
// ??? color hcl editor
export default function Home() {
  const rootName = 'root';
  const [notes, setNotes] = useLocalStorage('nNotes', defaultNotes);
  const [parentId, setParentId] = useLocalStorage('nParentId', rootName);
  const [menuId, setMenuId] = useState(null);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState([]);
  const hasParent = parentId !== rootName;

  const addNote = () => {
    const id = uuidv4();
    route(`/notes/${id}/edit`);
  };

  const deleteNote = (id, confirm = true) => {
    const ids = confirm ? findChildIds(notes, id) : [];

    setConfirmDeleteIds(ids);
    console.log('delete', ids.length, ids);

    if (ids.length <= 1) {
      deleteChild(setNotes, parentId, id);
    }
  };

  const goUp = () => {
    const grandparentId = notes[parentId]?.parentId;

    if (grandparentId) {
      route(`/notes/${grandparentId}`);
    }
  };

  const moveDown = (id) => {
    // ??? implement
    console.log('MOVE-DOWN', id, 'pick child next');
  };

  const moveFirst = (id) => {
    const index = notes[parentId].children.findIndex((child) => child === id);

    moveChild(setNotes, parentId, index, 0);
  };

  const moveNote = (id, toId) => {
    const parent = notes[parentId];
    const fromIndex = parent.children.findIndex((child) => child === id);
    const toIndex = parent.children.findIndex((child) => child === toId);

    moveChild(setNotes, parentId, fromIndex, toIndex);
  };

  const moveUp = (id) => {
    if (notes[parentId].parentId) {
      moveChildUp(setNotes, parentId, id);
      goUp();
    }
  };

  const saveNote = (note) => {
    updateNote(setNotes, parentId, note);
  };

  const handleUrlChange = (e) => {
    if (e.path === '/notes/:id') {
      setParentId(e.matches.id);
    }
  };

  return (
    <>
      <Router
        history={createHashHistory()}
        onChange={handleUrlChange} 
      >
        <Edit
          path="/notes/:id/edit"
          notes={notes}
          parentId={parentId}
          saveNote={saveNote}
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
      { (confirmDeleteIds.length >= 1) && (
        <div>{`confirm delete (${confirmDeleteIds})`}</div>
      ) }
    </>
  );
}
