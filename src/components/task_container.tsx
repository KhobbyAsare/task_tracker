import "./Layout.css"
import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DRAG_TYPE = 'ITEM';

interface DragItem {
  id: number;
  text: string;
  description?: string;
  date?: string;
}

interface DraggableProps {
  id: number;
  text: string;
  description?: string;
  date?: string;
}

const Draggable: React.FC<DraggableProps> = ({ id, text, description, date }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_TYPE,
    item: { id, text, description, date }, // Pass the full item object
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, text, description, date]);

  return (
    <div
      ref={drag}
      className="draggable-item h-40 w-full p-2 rounded bg-gray-950 cursor-move"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="storyCard h-full w-full flex flex-col gap-2 p-2 rounded justify-between shadow-gray-200">
        <div className="storyCardHead text-2xl font-bold">{text}</div>
        <div className="storyCardBody text-sm truncate">{description}</div>
        <div className="storyCardDate">{date}</div>
      </div>
    </div>
  );
};

interface DropZoneProps {
  dropItems: DragItem[];
  onDrop: (item: DragItem) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ dropItems, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: DRAG_TYPE,
    drop: (item: DragItem) => {
      onDrop(item);
      return item;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [dropItems]);

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
            text={item.text}
            description={item.description}
            date={item.date}
          />
        ))
      ) : (
        <p className="text-gray-500">Drop items here</p>
      )}
    </div>
  );
};

const TaskContainer: React.FC = () => {
  const [grid1Items, setGrid1Items] = useState<DragItem[]>([
    { id: 1, text: 'Item 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam ad earum accusantium corrupti inventore? Neque est consequuntur animi. Suscipit eos minima veritatis, necessitatibus ut expedita neque corporis doloribus numquam ipsum.', date: '2023-10-01' },
    { id: 2, text: 'Item 2', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam ad earum accusantium corrupti inventore? Neque est consequuntur animi. Suscipit eos minima veritatis, necessitatibus ut expedita neque corporis doloribus numquam ipsum.', date: '2023-10-02' },
  ]);
  const [grid2Items, setGrid2Items] = useState<DragItem[]>([]);
  const [grid3Items, setGrid3Items] = useState<DragItem[]>([]);
  const [grid4Items, setGrid4Items] = useState<DragItem[]>([]);
  const [open, setOpen] = useState(false)

  const handleDrop = (
    item: DragItem,
    setTargetGrid: React.Dispatch<React.SetStateAction<DragItem[]>>,
    sourceGrid: DragItem[],
    setSourceGrid: React.Dispatch<React.SetStateAction<DragItem[]>>
  ) => {
    // Add the dropped item to the target grid
    setTargetGrid((prev) => [...prev, item]);

    // Remove the dropped item from the source grid
    setSourceGrid((prev) => prev.filter((dragItem) => dragItem.id !== item.id));
  };

  const show = () => {
    setOpen(!open)
  }

  const handleAddTask = (e) => {
    const email = e.target.elements.email.value;

    if (!email) {
      alert("Please enter an email");
      return;
    }
    const newItem: DragItem = {
      id: Date.now(),
      text: '',
      description: 'Description of the new task',
      date: new Date().toISOString().split('T')[0],
    };
    setGrid1Items((prev) => [...prev, newItem]);
    setOpen(!open)
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-container h-full w-full grid grid-cols-4 divide-x divide-gray-700">
        <div className="h-auto grid-column flex flex-col items-center p-4 gap-1">
          <h2 className="text-3xl font-bold mb-4">User Story:</h2>
          <div className="card-container h-100 w-full flex flex-col gap-1 overflow-y-auto">
            {grid1Items.map((item) => (
              <Draggable key={item.id} id={item.id} text={item.text} description={item.description} date={item.date} />
            ))}
          </div>
          <button className="AddStory bg-gray-950 text-white p-2 rounded-lg hover:bg-gray-700 transition-all ease-in duration-300" onClick={show}>
            <i className="bi bi-plus-lg"></i>
            <span className="text-lg font-bold">Add Task</span>
          </button>
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">To do:</h2>
          <DropZone
            dropItems={grid2Items}
            onDrop={(item) =>
              handleDrop(item, setGrid2Items, grid1Items, setGrid1Items)
            }
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">In progress:</h2>
          <DropZone
            dropItems={grid3Items}
            onDrop={(item) =>
              handleDrop(item, setGrid3Items, grid2Items, setGrid2Items)
            }
          />
        </div>
        <div className="grid-column flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-4">Done:</h2>
          <DropZone
            dropItems={grid4Items}
            onDrop={(item) =>
              handleDrop(item, setGrid4Items, grid3Items, setGrid3Items)
            }
          />
        </div>
        {
          open ? (
            <div className="newTask bg-gray-800">
              <input type="text" name="name" id="Title" />
              <input type="text" name="description" id="Desc" />
              <input type="date" name="" id="Date" />
              <button className="newBTN bg-gray-950" onClick={handleAddTask}>Add</button>
            </div>
          ):('')
        }
        
      </div>
    </DndProvider>
  );
};

export default TaskContainer;
