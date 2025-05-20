import { Link } from 'react-router-dom';
import { routes } from '../route'; 
import { useState } from 'react';

const SideMenu = () => {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpenMobile(!isOpenMobile);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button 
        className="md:hidden fixed top-2 left-2 z-20 bg-[#3D348B] text-white p-2 rounded-md"
        onClick={toggleMobileMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar for both mobile and desktop */}
      <aside 
        className={`sideBar h-full p-3 ${isCollapsed ? 'w-16' : 'w-60'} gap-10 text-white bg-[#3D348B] z-10 transition-all duration-300 ease-in-out
          ${isOpenMobile ? 'fixed inset-y-0 left-0' : 'fixed inset-y-0 -left-60 md:left-0'} md:relative md:flex-shrink-0`}
      >
        <div className="p-4 flex justify-between items-center">
          {/* App logo or name on the left side */}
          <div className={`text-white font-bold ${isCollapsed ? 'hidden' : 'block'}`}>
            Task App
          </div>
          <div className="flex items-center">
            {/* Toggle icon pushed to the right */}
            <i 
              className={`bi ${isCollapsed ? 'bi-filter-right' : 'bi-filter-left'} text-5xl font-bold cursor-pointer`}
              onClick={toggleCollapse}
            ></i>
            <button 
              className={`md:hidden text-white ml-2 ${isCollapsed ? 'hidden' : 'block'}`}
              onClick={toggleMobileMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="flex flex-col p-4 gap-4 text-lg justify-start items-start text-white" >
          <Link to={routes.dashboard} className={`w-full p-1 flex flex-row gap-5 justify-start content-center border-2 border-none rounded-lg hover:bg-[#322b70] ${isCollapsed ? 'justify-center' : 'hover:justify-center'} transition-all ease-in duration-300`} onClick={() => setIsOpenMobile(false)}>
            <i className="bi bi-pie-chart-fill text-1xl font-bold text-white"></i>
            <span className={`text-white ${isCollapsed ? 'hidden' : 'block'}`}>Dashboard</span>
          </Link>
          <Link to={routes.taskTracker} className={`w-full p-1 flex flex-row gap-5 justify-start content-center border-2 border-none rounded-lg hover:bg-[#322b70] ${isCollapsed ? 'justify-center' : 'hover:justify-center'} transition-all ease-in duration-300`} onClick={() => setIsOpenMobile(false)}>
            <i className="bi bi-grid-1x2-fill text-1xl font-bold text-white"></i>
            <span className={`text-white ${isCollapsed ? 'hidden' : 'block'}`}>Task Tracker</span>
          </Link>
        </nav>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpenMobile && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
};

export default SideMenu;