import { Router, route } from 'preact-router';
import { createHashHistory } from 'history';
import { v4 as uuidv4 } from 'uuid';
import { move } from 'utilities/array';
import { useLocalStorage } from 'utilities/hooks';
import Edit from './Edit';
import Notes from './Notes';
import Redirect from './Redirect';

const defaultNotes = {
  root: {
    children: [],
    id: 'root',
  },
};

export default function Home() {
  const [notes, setNotes] = useLocalStorage('nNotes', defaultNotes);
  const [parentId, setParentId] = useLocalStorage('nParentId', 'root');

  const moveNote = (id, toId) => {
    const parent = notes[parentId];
    const children = parent.children;
    const index = children.findIndex((child) => child === id);
    const toIndex = children.findIndex((child) => child === toId);

    setNotes((notes) => ({
      ...notes,
      [parentId]: {
        ...parent,
        children: move(children, index, toIndex),
      },
    }));
  };

  const addNote = (pid) => {
    const id = uuidv4();
    setParentId(pid);
    route(`/notes/${id}/edit`);
  };

  const saveNote = (note, pid) => {
    setNotes((notes) => {
      const parent = notes[pid];
      const isNew = parent.children.findIndex((id) => id === note.id) === -1;
      const children = isNew ? [...parent.children, note.id] : parent.children;

      return {
        ...notes,
        [note.id]: {
          ...note,
        },
        [pid]: {
          ...parent,
          children,
        },
      };
    });
  };

  return (
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
        moveNote={moveNote}
      />
      <Redirect default to="/notes/root" />
    </Router>
  );
}
