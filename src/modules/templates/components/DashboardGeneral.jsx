import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
import ResponsiveText from '../../shared/components/ResponsiveText';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';
import UserButton from '../../auth/components/UserButton';


function DashboardGeneral() {
  const [openMenu, setOpenMenu] = useState(false);

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
  const isCustomer = localStorage.getItem("customerId") !='null' ? true : false;

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

    return <UserButton className={'hidden lg:block'} />;
  };

  const renderDesktopNavbar = () => (
    <nav className='lg:block hidden gap-4 px-3 rounded-lg bg-white'>
      <div className='flex justify-between gap-5'>
        <Button 
          onClick={() => navigate('/')}
          variant={location.pathname === '/'
                ? 'default'
                : 'secondary'
              }
        >
          Productos
        </Button>
        <Button 
          onClick={() => navigate('/cart')}
          variant={location.pathname === '/cart'
                ? 'default'
                : 'secondary'
              }
        >
          Carrito de compras
        </Button>
      </div>
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
        {renderAuthButtons()}
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
            lg:hidden 
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
          shadow
          flex
          z-40
          flex-col
          justify-between
          transition-all duration-300
          lg:hidden 
        `}
      >
        <nav>
          {renderMobileNavLinks()}
          <hr className='opacity-15 mt-4' />
            <div className="mt-4">
              <UserButton className="block w-full lg:hidden" />
            </div>
        </nav>
        
      </aside>
      <Modal isOpen={isOpenLogin} onClose={() => setIsOpenLogin(false)}>
            <div className="flex flex-col gap-3">
                <LoginForm />
            </div>
        </Modal>
        <Modal isOpen={isOpenSignup} onClose={() => setIsOpenSignup(false)}>
            <div className="flex flex-col gap-3">
                <RegisterForm hasRole={!isCustomer}/>
            </div>
        </Modal>

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

export default DashboardGeneral;