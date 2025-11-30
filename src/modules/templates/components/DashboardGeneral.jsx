import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../auth/hook/useAuth';
import Button from '../../shared/components/Button';
import logo from '../../../../public/logoCompletoEcommerce.png';
import smallLogo from '../../../../public/logoEcommerce1.png';
import ResponsiveText from '../../shared/components/ResponsiveText';
import Modal from '../../shared/components/Modal';
import LoginForm from '../../auth/components/LoginForm';
import RegisterForm from '../../auth/components/RegisterForm';


function DashboardGeneral() {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    //FALTA AGREGAR FUNCIONALIDAD DE BUSQUEDA
  };

  const location = useLocation();

  const navigate = useNavigate();
  
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenSignup, setIsOpenSignup] = useState(false);

  const { singOut } = useAuth();

  // const logout = () => {
  //   singOut();
  //   navigate('/login');
  // };
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

  const renderAuthButtons = () => (
    <div className='hidden sm:flex gap-4'>
      <Button 
        className='bg-purple-200 hover:bg-purple-100' 
        onClick={() => {openLoginModal()}}
      >
        Iniciar Sesión
      </Button>
      <Button 
        className='bg-gray-200 hover:bg-gray-100' 
        onClick={() => {openSignupModal()}}
      >
        Registrarse
      </Button>
    </div>
  );

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
    <div className='flex items-center border border-gray-300 rounded-full px-4 py-2 w-full max-w-sm'>
      <input 
        value={searchTerm} 
        onChange={(evt) => setSearchTerm(evt.target.value)} 
        type="text" 
        placeholder='Search'
        className='text-base w-full focus:outline-none' 
      />
      <button 
        className='ml-2 text-gray-500 hover:text-gray-700' 
        onClick={handleSearch}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='h-5 w-5'>
          <g id="SVGRepo_iconCarrier"> 
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> 
          </g>
        </svg>
      </button>
    </div>
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
          src={logo} 
          alt="Logo" 
          width="200" 
          className='hidden sm:block' 
        />
        <img 
          src={smallLogo} 
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