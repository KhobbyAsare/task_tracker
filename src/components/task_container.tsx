import "./Layout.css"
import React, { useState, FormEvent } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DRAG_TYPE = 'ITEM';

interface DragItem {
  id: number; 
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';  
  text: string;
  description?: string;
  date?: string;
}

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

  return (
    <div
      ref={drag}
      className="draggable-item h-40 w-full p-2 rounded bg-gray-950 cursor-move relative"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {onRemove && (
        <button 
          onClick={handleRemove}
          className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700 z-10"
          title="Remove task"
        >
          ×
        </button>
      )}
      <div className="storyCard h-full w-full flex flex-col gap-2 p-2 rounded justify-between shadow-gray-200">
        <div className="storyCardHead text-2xl font-bold">{text}</div>
        <div className="storyCardHead text-xl font-semibold">{getStatusDisplayName(status)}</div>
        <div className="storyCardBody text-sm truncate">{description}</div>
        <div className="storyCardDate">{date}</div>
      </div>
    </div>
  );
};

interface DropZoneProps {
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  dropItems: DragItem[];
  onDrop: (item: DragItem) => void;
  onRemoveItem: (id: number) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ status, dropItems, onDrop, onRemoveItem }) => {
  const [, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: DragItem) => {
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
      className="drop-zone h-115 w-full flex flex-col gap-1 rounded transition-all overflow-y-auto"
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
        <p className="text-gray-500">Drop items here</p>
      )}
    </div>
  );
};

// Replace with props
interface TaskContainerProps {
  tasks: DragItem[];
  onDrop: (item: DragItem, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => void;
  onRemoveTask: (id: number) => void;
  onAddTask: (newTask: DragItem) => void;
}

const TaskContainer: React.FC<TaskContainerProps> = ({ tasks, onDrop, onRemoveTask, onAddTask }) => {
  const [open, setOpen] = useState(false);

  // Filter items based on their status
  const pendingItems = tasks.filter(item => item.status === 'pending');
  const inProgressItems = tasks.filter(item => item.status === 'in-progress');
  const submittedItems = tasks.filter(item => item.status === 'submitted');
  const completedItems = tasks.filter(item => item.status === 'completed');

  const handleDrop = (item: DragItem, newStatus: 'pending' | 'in-progress' | 'submitted' | 'completed') => {
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
    
    const newItem: DragItem = {
      id: Date.now(),
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
      <div className="kanban-container h-full w-full grid grid-cols-4 divide-x divide-gray-700">
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">Pending</h2>
          <DropZone
            status="pending"
            dropItems={pendingItems}
            onDrop={(item) => handleDrop(item, 'pending')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">In Progress</h2>
          <DropZone
            status="in-progress"
            dropItems={inProgressItems}
            onDrop={(item) => handleDrop(item, 'in-progress')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">Submitted</h2>
          <DropZone
            status="submitted"
            dropItems={submittedItems}
            onDrop={(item) => handleDrop(item, 'submitted')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">Completed</h2>
          <DropZone
            status="completed"
            dropItems={completedItems}
            onDrop={(item) => handleDrop(item, 'completed')}
            onRemoveItem={(id) => removeTask(id)}
          />
        </div>
        <button 
          className="AddStory fixed right-6 bottom-6 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all ease-in duration-300 shadow-lg"
          onClick={show}
          title="Add new task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
        {
          open && (
            <div className="newTask fixed inset-0 flex items-center justify-center  bg-opacity-50 z-20">
              <form onSubmit={handleAddTask} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 w-96">
                <h3 className="text-xl font-bold mb-2">Add New Task</h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Title">Title</label>
                  <input type="text" name="name" id="Title" className="p-2 rounded bg-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Desc">Description</label>
                  <textarea name="description" id="Desc" className="p-2 rounded bg-gray-700" rows={3}></textarea>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Date">Due Date</label>
                  <input type="date" name="date" id="Date" className="p-2 rounded bg-gray-700" />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="Status">Status</label>
                  <select name="status" id="Status" className="p-2 rounded bg-gray-700">
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button type="button" className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500" onClick={show}>Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Add Task</button>
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