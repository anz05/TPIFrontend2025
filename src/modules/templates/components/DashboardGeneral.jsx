import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
import ResponsiveText from '../../shared/components/ResponsiveText';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';


function DashboardGeneral() {
  const [openMenu, setOpenMenu] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSearchSubmit = (e) => {
      e.preventDefault();
      const query = e.target.elements.search.value; 
      navigate(`/?search=${encodeURIComponent(query)}`); 
      if (location.pathname !== '/') {
          navigate(`/?search=${encodeURIComponent(query)}`);
      } else {
          navigate({ search: `?search=${encodeURIComponent(query)}` });
      }
  };

  const location = useLocation();

  const navigate = useNavigate();
  
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);

  const [showUserMenu, setShowUserMenu] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  const openLoginModal = () => {
    setIsOpenLogin(true);
  };

  const openSignupModal = () => {
    setIsOpenSignup(true);
  }
  const getLinkStyles = ({ isActive }) => (
    `
      pl-4 w-full block  pt-4 pb-4 rounded-4xl transition hover:bg-gray-100
      ${isActive
      ? 'bg-purple-200 hover:bg-purple-100 '
      : ''
    }
    `
  );

  const renderLogoutButton = () => (
    <Button onClick={logout}>Cerrar sesión</Button>
  );
  
  const renderAuthButtons = () => {
    const token = localStorage.getItem('token');
    const isLogged = token && token !== 'null';

    if (!isLogged) {
      return (
        <div className='hidden sm:flex gap-4'>
          <Button
            className='bg-purple-200 hover:bg-purple-100'
            onClick={() => openLoginModal()}
          >
            Iniciar Sesión
          </Button>
          <Button
            className='bg-gray-200 hover:bg-gray-100'
            onClick={() => openSignupModal()}
          >
            Registrarse
          </Button>
        </div>
      );
    }

    return (
      <div className="relative">
        <button
          className="h-8 w-8 rounded-2xl bg-purple-200 flex items-center justify-center"
          onClick={() => setShowUserMenu((s) => !s)}
          aria-expanded={showUserMenu}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#5d3276" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
          </svg>
        </button>

        {showUserMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded p-2 z-50">
            <Button className="w-full" onClick={() => { setShowUserMenu(false); logout(); }}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderDesktopNavbar = () => (
    <nav className='hidden sm:flex gap-4'>
      <button 
        onClick={() => navigate('/')}
        className={`
          font-medium
          ${location.pathname === '/' || location.pathname === '/products'
            ? 'bg-purple-200 hover:bg-purple-100'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }
        `}
      >
        Productos
      </button>
      <button 
        onClick={() => navigate('/cart')}
        className={`
          font-medium
          ${location.pathname === '/cart'
            ? 'bg-purple-200 hover:bg-purple-100'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }
        `}
      >
        Carrito de compras
      </button>
    </nav>
  );

const renderSearchBar = () => (
    <form
        onSubmit={handleSearchSubmit}
        className="flex items-center flex-1 mx-3 border border-gray-300 rounded-lg h-9 overflow-hidden"
    >
        <input
            type="text"
            name="search" 
            placeholder="Search"
            className="w-full p-2 outline-none text-gray-700 text-sm"
            defaultValue={new URLSearchParams(location.search).get('search') || ''} 
        />
        <button
            type="submit"
            className="bg-white p-2 text-gray-500 hover:text-purple-600 transition h-full"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
    </form>
    

);

  const renderMobileNavLinks = () => (
    <ul className='flex flex-col'>
      <li>
        <NavLink to='/' className={getLinkStyles} onClick={() => setOpenMenu(false)}>
          <ResponsiveText>Productos</ResponsiveText>
        </NavLink>
      </li>
      <li>
        <NavLink to='/cart' className={getLinkStyles} onClick={() => setOpenMenu(false)}>
          <ResponsiveText>Carrito de compras</ResponsiveText>
        </NavLink>
      </li>
      <li>
        <NavLink to='/login' className={getLinkStyles} onClick={() => setOpenMenu(false)}>
          <ResponsiveText>Iniciar sesión</ResponsiveText>
        </NavLink>
      </li>
      <li>
        <NavLink to='/signup' className={getLinkStyles} onClick={() => setOpenMenu(false)}>
          <ResponsiveText>Registrarse</ResponsiveText>
        </NavLink>
      </li>
    </ul>
  );


  return (
    <div
      className="
        h-full
        grid
        grid-cols-1
        grid-rows-[auto_1fr]

        sm:gap-3
        sm:grid-cols-1
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
          sm:col-span-1
          sm:px-6 
          sm:py-4
          gap-4
        "
      >
        <img 
          src="/logoCompletoEcommerce.png"
          alt="Logo" 
          width="200" 
          className='hidden sm:block' 
        />
        <img 
          src="/logoEcommerce1.png" 
          alt="Small Logo" 
          width="40" 
          className='sm:hidden' 
        />

        {renderDesktopNavbar()}

        <div className='flex-grow sm:flex-grow-0'>
          {renderSearchBar()}
        </div>
        
        {renderAuthButtons()}

        <button
          className="
            bg-transparent
            border-none
            shadow-none
            sm:hidden 
            text-2xl 
            p-1 
            w-10 
            h-10
          "
          onClick={() => setOpenMenu(!openMenu)}
        >
          { openMenu ? <span>&#215;</span> : <span>&#9776;</span>}
        </button>
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

          sm:hidden // CAMBIO 3: Oculta el aside en pantallas grandes
        `}
      >
        <nav>
          {renderMobileNavLinks()}
          <hr className='opacity-15 mt-4' />
        </nav>
        
      </aside>
      <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
            <div className="flex flex-col gap-3">
                <LoginForm />
            </div>
        </Modal>
        <Modal isOpen={isOpenSignup} onClose={() => setIsOpenSignup(false)}>
            <div className="flex flex-col gap-3">
                <RegisterForm hasRole={false}/>
            </div>
        </Modal>

      <main
        className="
          p-5
          overflow-y-scroll
          sm:col-span-1 // CAMBIO 4: Asegura que ocupe la columna completa
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardGeneral;