import React, { useState, FormEvent } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task } from '../store/taskStore';

const DRAG_TYPE = 'ITEM';

interface DraggableProps {
  id: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  text: string;
  description?: string;
  date?: string;
  onRemove?: (id: number) => void;
}

const Draggable: React.FC<DraggableProps> = ({ id, status, text, description, date, onRemove }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: { id, status, text, description, date }, // Pass the full item object
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, status, text, description, date]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(id);
    }
  };

  // Define status display names for better readability
  const getStatusDisplayName = (status: string) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  // Define status colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={drag}
      className="draggable-item h-auto min-h-32 w-full p-2 rounded bg-[#3D348B] shadow-md border border-[#322b70] cursor-move relative"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {onRemove && (
        <button 
          onClick={handleRemove}
          className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 z-10"
          title="Remove task"
        >
          ×
        </button>
      )}
      <div className="storyCard h-full w-full flex flex-col gap-2 p-2 rounded justify-between">
        <div className="storyCardHead text-lg sm:text-xl md:text-2xl font-bold line-clamp-2 text-white">{text}</div>
        <div className={`storyCardStatus text-xs py-1 px-2 rounded-full inline-block w-fit ${getStatusColor(status)}`}>
          {getStatusDisplayName(status)}
        </div>
        <div className="storyCardBody text-xs sm:text-sm text-gray-200 truncate">{description}</div>
        <div className="storyCardDate text-xs sm:text-sm text-gray-300">{date}</div>
      </div>
    </div>
  );
};

interface DropZoneProps {
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  dropItems: Task[];
  onDrop: (item: Task) => void;
  onRemoveItem: (id: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ status, dropItems, onDrop, onRemoveItem }) => {
  const [, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: Task) => {
      onDrop({...item, status}); // Update status when dropping
      return item;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dropItems, status, onDrop]);

  return (
    <div
      ref={drop}
      className="drop-zone h-115 w-full flex flex-col gap-3 rounded transition-all overflow-y-auto p-2"
    >
      {dropItems.length > 0 ? (
        dropItems.map((item) => (
          <Draggable
            key={item.id}
            id={item.id}
            status={item.status}
            text={item.text}
            description={item.description}
            date={item.date}
            onRemove={onRemoveItem}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100/50">Drop items here</p>
      )}
    </div>
  );
};

// Replace with props
interface TaskContainerProps {
  tasks: Task[];
  onDrop: (item: Task, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => void;
  onRemoveTask: (id: number) => void;
  onAddTask: (newTask: Task) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({ tasks, onDrop, onRemoveTask, onAddTask }) => {
  const [open, setOpen] = useState(false);

  // Filter items based on their status
  const pendingItems = tasks.filter(item => item.status === 'pending');
  const inProgressItems = tasks.filter(item => item.status === 'in-progress');
  const submittedItems = tasks.filter(item => item.status === 'submitted');
  const completedItems = tasks.filter(item => item.status === 'completed');

  const handleDrop = (item: Task, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => {
    onDrop(item, newStatus);
  };

  const removeTask = (id: number) => {
    onRemoveTask(id);
  };

  const show = () => {
    setOpen(!open);
  };

  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    const titleInput = form.elements.namedItem('name') as HTMLInputElement;
    const descInput = form.elements.namedItem('description') as HTMLInputElement;
    const dateInput = form.elements.namedItem('date') as HTMLInputElement;
    const statusInput = form.elements.namedItem('status') as HTMLSelectElement;

    if (!titleInput.value) {
      alert("Please enter a title");
      return;
    }
    
    const newItem: Task = {
      id: Date.now(), // This ID will be overwritten by the store's addTask function
      status: statusInput.value as 'pending' | 'in-progress' | 'submitted' | 'completed',
      text: titleInput.value,
      description: descInput.value || 'Description of the new task',
      date: dateInput.value || new Date().toISOString().split('T')[0],
    };
    
    onAddTask(newItem);
    setOpen(false);
    
    // Reset form
    form.reset();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container h-full w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/20 overflow-auto bg-white rounded-lg p-4 shadow-lg">
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#3D348B]">Pending</h2>
          <DropZone
            status="pending"
            dropItems={pendingItems}
            onDrop={(item) => handleDrop(item, 'pending')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#3D348B]">In Progress</h2>
          <DropZone
            status="in-progress"
            dropItems={inProgressItems}
            onDrop={(item) => handleDrop(item, 'in-progress')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#3D348B]">Submitted</h2>
          <DropZone
            status="submitted"
            dropItems={submittedItems}
            onDrop={(item) => handleDrop(item, 'submitted')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#3D348B]">Completed</h2>
          <DropZone
            status="completed"
            dropItems={completedItems}
            onDrop={(item) => handleDrop(item, 'completed')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <button 
          className="AddStory fixed right-6 bottom-6 bg-[#3D348B] text-white p-3 rounded-full hover:bg-[#322b70] transition-all ease-in duration-300 shadow-lg"
          onClick={show}
          title="Add new task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        {
          open && (
            <div className="fixed inset-0 flex items-center justify-center p-4 bg-[#00000098] bg-opacity-0 z-20">
              <form onSubmit={handleAddTask} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg flex flex-col gap-4 w-full max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2 text-[#3D348B]">Add New Task</h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Title" className="text-gray-700">Title</label>
                  <input type="text" name="name" id="Title" className="h-10 sm:h-12 w-full rounded border border-gray-300 p-2 text-gray-800" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Desc" className="text-gray-700">Description</label>
                  <textarea name="description" id="Desc" className="p-2 rounded border border-gray-300 w-full text-gray-800" rows={3}></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Date" className="text-gray-700">Due Date</label>
                  <input type="date" name="date" id="Date" className="p-2 rounded border border-gray-300 w-full text-gray-800" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Status" className="text-gray-700">Status</label>
                  <select name="status" id="Status" className="p-2 rounded border border-gray-300 w-full text-gray-800">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300" onClick={show}>Cancel</button>
                  <button type="submit" className="px-4 py-2 h-10 sm:h-12 text-white rounded bg-[#3D348B] hover:bg-[#322b70]">Add Task</button>
                </div>
              </form>
            </div>
          )
        }
      </div>
    </DndProvider>
  );
};

export default TaskContainer;