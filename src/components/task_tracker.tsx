import React from 'react';
import TaskContainer from './task_container';

interface DragItem {
  id: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  text: string;
  description?: string;
  date?: string;
}

interface TaskTrackerProps {
  tasks: DragItem[];
  onDrop: (item: DragItem, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => void;
  onRemoveTask: (id: number) => void;
  onAddTask: (newTask: DragItem) => void;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ tasks, onDrop, onRemoveTask, onAddTask }) => {
  return (
    <div className="task-tracker">
      <TaskContainer
        tasks={tasks}
        onDrop={onDrop}
        onRemoveTask={onRemoveTask}
        onAddTask={onAddTask}
      />
    </div>
  );
};

export default TaskTracker;