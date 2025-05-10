import { Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import "./Layout.css";
import SideMenu from './side_menu.tsx';
import TaskContainer from './task_container.tsx';

const FullScreenLayout = () => {
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
            <Route path="/" element={<h1>Welcome to the Dashboard</h1>} />
            <Route path="/task-tracker" element={<TaskContainer />} />
          </Routes>
        </main>
      </DndProvider>
    </div>
  );
};

export default FullScreenLayout;