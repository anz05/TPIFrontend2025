import useAuth from '../../auth/hook/useAuth';
import { useState } from 'react';
import ResponsiveText from '../../shared/components/ResponsiveText';
import Button from '../../shared/components/Button';
import { useNavigate } from 'react-router-dom';

function UserButton({ className = '' }){

    const { signOut } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    
    const logout = () => {
        signOut();
        navigate('/');
    };
    
    const buttonClass = `h-8 ${className.includes('w-full') ? 'w-full' : 'w-auto'} rounded-2xl bg-purple-100 flex items-center justify-between p-2`;

    return(
        <>
            <div className={`relative ${className}`}>
                <button
                    className={buttonClass}
                    onClick={() => setShowUserMenu((s) => !s)}
                    aria-expanded={showUserMenu}
                >
                <div className='flex items-center p-1'>
                    <ResponsiveText className='text-sm text-zinc-600'>{localStorage.getItem('userName')}</ResponsiveText>
                </div>
                <div className="h-8 w-8 rounded-2xl bg-white flex items-center justify-center p-1 border-1 border-zinc-600">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> <path d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#62516c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g>
                    </svg>
                </div>
                </button>

                {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded p-2 z-50">
                    
                    <Button className="w-full" onClick={() => { setShowUserMenu(false); logout(); }}>
                    Cerrar sesión
                    </Button>
                </div>
                )}
            </div>
        </>
    )
}
export default UserButton;