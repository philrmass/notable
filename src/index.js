import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import Home from './components/Home';
import NoteDragLayer from './components/NoteDragLayer';
import './style';

export default function App() {
  return (
    <DndProvider backend={TouchBackend}>
      <Home />
      <NoteDragLayer />
    </DndProvider>
  );
}
