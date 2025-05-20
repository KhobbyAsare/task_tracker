import React from 'react';
import TaskContainer from './task_container';
import { Task } from '../store/taskStore';

interface TaskTrackerProps {
  tasks: Task[];
  onDrop: (item: Task, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => void;
  onRemoveTask: (id: number) => void;
  onAddTask: (newTask: Task) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onDrop, onRemoveTask, onAddTask }) => {
  return (
    <div className="task-tracker w-full h-full flex flex-col overflow-hidden">
      <div className="head w-full px-4 py-3 sm:p-5 border-b border-gray-200 flex flex-row justify-between items-center">
        <div className="kanban">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3D348B]">Kanban Board</h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <TaskContainer
          tasks={tasks}
          onDrop={onDrop}
          onRemoveTask={onRemoveTask}
          onAddTask={onAddTask}
        />
      </div>
    </div>
  );
};

export default TaskTracker;