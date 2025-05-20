import { Routes, Route } from 'react-router-dom';
import SideMenu from './side_menu.tsx';
import TaskTracker from './task_tracker.tsx';
import Dashboard from './dashboard.tsx';
import { useTaskStore, useTasksSelector } from '../store/taskStore';
import { Task } from '../store/taskStore';

const FullScreenLayout = () => {
  // Get the tasks from the store using the selector for better performance
  const tasks = useTasksSelector();
  
  // Get the actions from the store
  const { updateTaskStatus, removeTask, addTask } = useTaskStore();

  // Handler for dropping a task to a new status
  const handleDrop = (item: Task, newStatus: Task['status']) => {
    updateTaskStatus(item.id, newStatus);
  };
 
  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Start Sidebar */}
      <SideMenu />
      {/* End Sidebar */}

      {/* Main Content */}
      <main className="h-full w-full flex flex-col flex-1 gap-4 md:gap-9 items-center overflow-auto bg-white">
        <div className="container mx-auto px-4 w-full max-w-screen-2xl py-4">
          <Routes>
            {/* Define routes here */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/task-tracker" element={
              <TaskTracker
                tasks={tasks}
                onDrop={handleDrop}
                onRemoveTask={removeTask}
                onAddTask={(newTask) => addTask(newTask)}
              />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default FullScreenLayout;