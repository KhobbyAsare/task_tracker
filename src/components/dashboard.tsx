import React from 'react';

interface DragItem {
  id: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'completed';
  text: string;
  description?: string;
  date?: string;
}

interface DashboardProps {
  tasks: DragItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks = [] }) => {
  // Count tasks by status
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
  const submittedCount = tasks.filter(task => task.status === 'submitted').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const totalCount = tasks.length;
  
  // Calculate completion percentage
  const completionPercentage = totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;
  
  return (
    <div className="dashboard bg-gray-950 p-6 rounded-lg">
      <div className="dashboard-header mb-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Task summary and progress overview</p>
      </div>
      
      {/* Task Summary Cards */}
      <div className="task-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="summary-card bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-sm text-gray-400 mb-1">Total Tasks</h3>
          <p className="text-3xl font-bold text-white">{totalCount}</p>
          <div className="mt-2 h-1 bg-gray-700 rounded-full">
            <div 
              className="h-1 bg-blue-500 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completionPercentage}% completed</p>
        </div>
        
        <div className="summary-card bg-yellow-900/30 p-4 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-300 mb-1">Pending</h3>
          <p className="text-3xl font-bold text-white">{pendingCount}</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-blue-900/30 p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-300 mb-1">In Progress</h3>
          <p className="text-3xl font-bold text-white">{inProgressCount}</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-purple-900/30 p-4 rounded-lg shadow-lg border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-300 mb-1">Submitted</h3>
          <p className="text-3xl font-bold text-white">{submittedCount}</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-green-900/30 p-4 rounded-lg shadow-lg border-l-4 border-green-500">
          <h3 className="text-sm text-gray-300 mb-1">Completed</h3>
          <p className="text-3xl font-bold text-white">{completedCount}</p>
          <p className="text-xs text-gray-400 mt-1">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="progress-overview bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Progress Overview</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Pending</span>
              <span className="text-sm text-gray-400">{pendingCount}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-yellow-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">In Progress</span>
              <span className="text-sm text-gray-400">{inProgressCount}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Submitted</span>
              <span className="text-sm text-gray-400">{submittedCount}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-purple-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (submittedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-400">Completed</span>
              <span className="text-sm text-gray-400">{completedCount}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Empty State */}
      {totalCount === 0 && (
        <div className="empty-state text-center py-8">
          <p className="text-gray-400">No tasks available. Start by adding some tasks to your board.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;