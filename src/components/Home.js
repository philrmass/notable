import { useState } from 'preact/hooks';
import { Router, route } from 'preact-router';
import { createHashHistory } from 'history';
import { v4 as uuidv4 } from 'uuid';
import { loadJsonFile, saveJsonFile } from 'utilities/file';
import { useLocalStorage } from 'utilities/hooks';
import { getIconSvgs } from 'utilities/Icon';
import { inSameMonth } from 'utilities/time';
import Edit from './Edit';
import EditColor from './EditColor';
import ConfirmDelete from './ConfirmDelete';
import Menu from './Menu';
import Message from './Message';
import MonthlySave from './MonthlySave';
import MoveDownParents from './MoveDownParents';
import Notes from './Notes';
import Redirect from './Redirect';
import RestoreButton from './RestoreButton';
import TopMenu from './TopMenu';
import {
  deleteChild,
  moveChild,
  moveChildDown,
  moveChildUp,
  updateNote,
} from '../utilities/actions';
import {
  addNotes,
  findChildIds,
  getLastAt,
  getSaveFilePath,
  parseNotes,
} from '../utilities/notes';

const icons = [
  'caretDown',
  'caretUp',
  'cross',
  'menu',
  'plus',
  'revert',
  'up',
];

export const defaultColors = [
  'lch(80 50 0deg)',
  'lch(80 50 45deg)',
  'lch(80 50 90deg)',
  'lch(80 50 135deg)',
  'lch(77 10 270deg)',
  'lch(73 20 30deg)',
  'lch(80 50 315deg)',
  'lch(80 50 270deg)',
];

const defaultNotes = {
  root: {
    children: [],
    id: 'root',
  },
};

export default function Home() {
  const rootName = 'root';
  const [notes, setNotes] = useLocalStorage('nNotes', defaultNotes);
  const [parentId, setParentId] = useLocalStorage('nParentId', rootName);
  const [colors, setColors] = useLocalStorage('nColors', defaultColors);
  const [message, setMessage] = useState('');
  const [topMenuShown, setTopMenuShown] = useState(false);
  const [monthlySaveShown, setMonthlySaveShown] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [moveDownId, setMoveDownId] = useState(null);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState([]);
  const [scrollId, setScrollId] = useState();
  const [deletedNote, setDeletedNote] = useState(null);
  const hasParent = parentId !== rootName;

  const addNote = () => {
    const id = uuidv4();

    route(`/notes/${id}/edit`);
  };

  const deleteNote = (id, confirm = true) => {
    const ids = confirm ? findChildIds(notes, id) : [];

    setConfirmDeleteIds(ids);

    if (ids.length <= 1) {
      if (confirm) {
        setDeletedNote({ ...notes[id] });
      }
      deleteChild(setNotes, parentId, id);
    }
  };

  const exportNotes = () => {
    saveJsonFile(getSaveFilePath(), notes);
  };

  const goUp = () => {
    const grandparentId = notes[parentId]?.parentId;

    if (grandparentId) {
      route(`/notes/${grandparentId}`);
    }
  };

  const importNotes = async (add) => {
    const data = await loadJsonFile();
    const parsed = parseNotes(data);

    if (parsed.error) {
      setMessage(parsed.error);
    } else if (parsed.notes) {
      const count = Object.keys(parsed.notes).length;

      if (add) {
        setNotes((last) => addNotes(last, parsed.notes));
        setMessage(`Added ${count} notes`);
      } else {
        setNotes(parsed.notes);
        setMessage(`Imported ${count} notes`);
      }
    }
  };

  const moveDown = (id) => {
    setMoveDownId(id);
  };

  const moveDownConfirm = (nextParentId) => {
    moveChildDown(setNotes, parentId, nextParentId, moveDownId);
    setMoveDownId(null);
    route(`/notes/${nextParentId}`);
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

  const resetColors = () => {
    setColors(defaultColors);
  };

  const saveNote = (note, toFirst, sid) => {
    setScrollId(sid);
    checkMonthlySave();
    updateNote(setNotes, parentId, note, toFirst);
    setDeletedNote(null);
  };

  const restoreNote = (note) => {
    updateNote(setNotes, note.parentId, note, true);
    setDeletedNote(null);
  };

  const checkMonthlySave = () => {
    const at = Date.now();
    const lastAt = getLastAt(notes);
    const noteCount = Object.keys(notes).length;

    if (!inSameMonth(at, lastAt) && noteCount > 3) {
      setMonthlySaveShown(true);
    }
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
        <EditColor
          path="/colors"
          colors={colors}
          resetColors={resetColors}
          setColors={setColors}
        />
        <Edit
          path="/notes/:id/edit"
          colors={colors}
          notes={notes}
          parentId={parentId}
          saveNote={saveNote}
        />
        <Notes
          path="/notes/:id"
          notes={notes}
          scrollId={scrollId}
          addNote={addNote}
          clearScrollId={() => setScrollId(null)}
          deleteNote={deleteNote} 
          goUp={goUp}
          moveNote={moveNote}
          openMenu={(id) => setMenuId(id)} 
          showTopMenu={() => setTopMenuShown(true)}
        />
        <Redirect default to="/notes/root" />
      </Router>
      <RestoreButton 
        shown={Boolean(deletedNote)}
        onClick={() => restoreNote(deletedNote)}
      />
      <Message 
        message={message}
        onClose={() => setMessage('')}
      />
      <TopMenu 
        shown={topMenuShown}
        importNotes={importNotes}
        exportNotes={exportNotes}
        onClose={() => setTopMenuShown(false)}
      />
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
      <MonthlySave 
        shown={monthlySaveShown}
        onClose={() => setMonthlySaveShown(false)}
        onSave={() => exportNotes()}
      />
      <ConfirmDelete
        count={confirmDeleteIds.length - 1}
        onDelete={() => deleteNote(confirmDeleteIds?.[0], false)}
        onClose={() => setConfirmDeleteIds([])}
      />
      <MoveDownParents
        moveDownId={moveDownId}
        notes={notes}
        parentId={parentId}
        shown={Boolean(moveDownId)}
        onClose={() => setMoveDownId(null)}
        onSelect={moveDownConfirm}
      />
      { getIconSvgs(icons) }
    </>
  );
}
