import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the type for our task
export interface Task {
  id: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  text: string;
  description?: string;
  date?: string;
}

// Define the type for our store
interface TaskState {
  tasks: Task[];
  addTask: (newTask: Omit<Task, 'id'>) => void;
  removeTask: (id: number) => void;
  updateTaskStatus: (id: number, newStatus: Task['status']) => void;
  clearAllTasks: () => void;
}

// Create the store with persist middleware to save state to localStorage
export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      // Initial state
      tasks: [ ],
      
      // Actions
      addTask: (newTask) => 
        set((state) => ({ 
          tasks: [...state.tasks, { ...newTask, id: Date.now() }] 
        })),
      
      removeTask: (id) => 
        set((state) => ({ 
          tasks: state.tasks.filter(task => task.id !== id) 
        })),
      
      updateTaskStatus: (id, newStatus) => 
        set((state) => ({ 
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, status: newStatus } : task
          ) 
        })),
      
      clearAllTasks: () => set({ tasks: [] }),
    }),
    {
      name: 'task-storage', // name of the item in localStorage
      partialize: (state) => ({ tasks: state.tasks }), // only save the tasks
    }
  )
);

// Optional: create a selector hook for better performance
export const useTasksSelector = () => useTaskStore(state => state.tasks);