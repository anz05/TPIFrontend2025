import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
import ResponsiveText from '../../shared/components/ResponsiveText';
import UserButton from '../../auth/components/UserButton';

function Dashboard() {
  const [openMenu, setOpenMenu] = useState(false);

  const navigate = useNavigate();

  const { signOut } = useAuth();

  const logout = () => {
    signOut();
    navigate('/');
  };

  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-2 pb-3 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  const renderUserButton = (mobile = false) => {
    return (
      <UserButton className={`${mobile ? 'block w-full sm:hidden' :  'hidden sm:block' }`} />
    );
  };

  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]

        sm:gap-3
        sm:grid-cols-[256px_1fr]
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          p-4
          shadow
          rounded
          bg-white

          sm:col-span-2
        "
      >
        <img src='/logoCompletoEcommerce.png' alt="Logo" width="200" />
        {renderUserButton()}
        <button
          className="
            bg-transparent
            border-none
            shadow-none

            sm:hidden
          "
          onClick={() => setOpenMenu(!openMenu)}
        >{ openMenu ? <span>&#215;</span> : <span>&#9776;</span>}</button>
      </header>
      <aside
        className={`
          absolute
          top-0
          bottom-0
          bg-white
          w-64
          p-6
          ${openMenu ? 'left-0' : 'left-[-256px]'}
          rounded
          shadow-2xl
          flex
          flex-col
          justify-between
          z-30
          transition-all duration-300
          sm:relative
          sm:left-0
        `}
      >
        <nav>
          <ul
            className='flex flex-col'
          >
            <li>
              <NavLink
                to='/admin/home'
                className={getLinkStyles}
              ><ResponsiveText>Principal</ResponsiveText></NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/products'
                className={getLinkStyles}
              ><ResponsiveText>Productos</ResponsiveText></NavLink>
            </li>
            <li>
              <NavLink
                to='/admin/orders'
                className={getLinkStyles}
              ><ResponsiveText>Ordenes</ResponsiveText></NavLink>
            </li>
          </ul>
          <hr className='opacity-15 mt-4' />
        </nav>
        {renderUserButton(true)}
      </aside>
      <main
        className="
          p-5
          overflow-y-scroll
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
