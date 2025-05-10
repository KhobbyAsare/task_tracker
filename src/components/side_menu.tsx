import { Link } from 'react-router-dom';
import { routes } from '../routes';

const SideMenu = () => {


    return (
        <aside className="sideBar h-full p-3 w-60 gap-10 text-white flex-shrink-0 bg-gray-950">
          <div className="p-4">
            <i className="bi bi-filter-left text-5xl font-bold"></i>
          </div>
          <nav className="flex flex-col p-4 gap-4 text-lg justify-start items-start text-white" >
            <Link to={routes.dashboard} className="w-full p-1 flex flex-row gap-5 justify-start content-center border-2 border-none rounded-lg hover:bg-gray-500 hover:justify-center transition-all ease-in duration-300"><i className="bi bi-pie-chart-fill text-1xl font-bold text-white"></i><span className='text-white'>Dashboard</span></Link>
            <Link to={routes.taskTracker} className="w-full p-1 flex flex-row gap-5 justify-start content-center border-2 border-none rounded-lg hover:bg-gray-500 hover:justify-center transition-all ease-in duration-300"><i className="bi bi-grid-1x2-fill text-1xl font-bold text-white"></i><span className='text-white'>Task Tracker</span></Link>
          </nav>
        </aside>
    )
}

export default SideMenu;