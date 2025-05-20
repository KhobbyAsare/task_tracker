import React from 'react';
import { Task, useTasksSelector } from '../store/taskStore';

// Accept props but use the store directly
const Dashboard: React.FC<{ tasks?: Task[] }> = () => {
  // Get tasks directly from the store
  const tasks = useTasksSelector();
  
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
    <div className="dashboard w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md overflow-y-auto">
      <div className="dashboard-header mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3D348B]">Dashboard</h1>
        <p className="text-gray-600 mt-1">Task summary and progress overview</p>
      </div>
      
      {/* Task Summary Cards */}
      <div className="task-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="summary-card bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-1">Total Tasks</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#3D348B]">{totalCount}</p>
          <div className="mt-2 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-[#3D348B] rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completionPercentage}% completed</p>
        </div>
        
        <div className="summary-card bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-sm text-gray-600 mb-1">Pending</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#3D348B]">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-sm text-gray-600 mb-1">In Progress</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#3D348B]">{inProgressCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount > 0 ? Math.round((inProgressCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-sm text-gray-600 mb-1">Submitted</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#3D348B]">{submittedCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
        
        <div className="summary-card bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-sm text-gray-600 mb-1">Completed</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#3D348B]">{completedCount}</p>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% of all tasks
          </p>
        </div>
      </div>
      
      {/* Progress Overview */}
      <div className="progress-overview bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-[#3D348B] mb-4">Progress Overview</h2>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-gray-600">Pending</span>
              <span className="text-xs sm:text-sm text-gray-600">{pendingCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-yellow-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-gray-600">In Progress</span>
              <span className="text-xs sm:text-sm text-gray-600">{inProgressCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-gray-600">Submitted</span>
              <span className="text-xs sm:text-sm text-gray-600">{submittedCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-purple-500 rounded-full" 
                style={{ width: `${totalCount > 0 ? (submittedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-xs sm:text-sm text-gray-600">Completed</span>
              <span className="text-xs sm:text-sm text-gray-600">{completedCount}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
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
          <p className="text-gray-600">No tasks available. Start by adding some tasks to your board.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;