import { Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';

import "./Layout.css";
import SideMenu from './side_menu.tsx';
import TaskTracker from './task_tracker.tsx';
import Dashboard from './dashboard.tsx';

interface DragItem {
  id: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  text: string;
  description?: string;
  date?: string;
}

const FullScreenLayout = () => {
  const [tasks, setTasks] = useState<DragItem[]>([
    { id: 1, status: 'pending', text: 'Item 1', description: 'Task 1 description', date: '2023-10-01' },
    { id: 2, status: 'pending', text: 'Item 2', description: 'Task 2 description', date: '2023-10-02' },
  ]);

  const handleDrop = (item: DragItem, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => {
    setTasks((prev) =>
      prev.map((existingItem) =>
        existingItem.id === item.id ? { ...existingItem, status: newStatus } : existingItem
      )
    );
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddTask = (newTask: DragItem) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="h-screen w-screen flex flex-row overflow-hidden">
      {/* Start Sidebar */}
      <SideMenu />
      {/* End Sidebar */}

      {/* Main Content */}
      <DndProvider backend={HTML5Backend}>
        <main className="h-full w-full flex flex-col flex-1 gap-9 items-center">
          <div className="head h-10 w-11/12 p-5 border-b-2 border-gray-500 flex flex-row justify-between items-center">
            <div className="kanban">
              <h1 className="text-3xl font-bold text-white">Kanban Board</h1>
            </div>
          </div>
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<Dashboard tasks={tasks} />} />
            <Route path="/task-tracker" element={
              <TaskTracker
                tasks={tasks}
                onDrop={handleDrop}
                onRemoveTask={removeTask}
                onAddTask={handleAddTask}
              />
            } />
          </Routes>
        </main>
      </DndProvider>
    </div>
  );
};

export default FullScreenLayout;