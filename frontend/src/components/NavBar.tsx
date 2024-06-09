import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserI } from "../types/Types";
import useAuth from "../services/Api";

export default function NavBar() {
  const location = useLocation();
  const { logout } = useAuth();

  const initialData: UserI = {
    id_user: 0,
    email: "",
    fullName: "",
    profilePicture: "",
  };

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const [user, setUser] = useState<UserI>(initialData);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    console.log(location.pathname);

    const token = window.localStorage.getItem("token")
    const idUser = localStorage.getItem("idUser");

    if (idUser) {
      setUser({ ...user, id_user: Number(idUser) })
      const fetchData = async () => {
        try {
          const response = await fetch(`https://woodwork.onrender.com/v1/api/user/getUserById/${idUser}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }); { }
          console.log(response);

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data: UserI = await response.json();
          setUser(data)
        } catch (error: any) {
          console.log(error);
          // setError(error.message);
        } finally {
          // setLoading(false);
        }
      };
      fetchData();
    }
  }, []);

  const logOut = () => {
    logout()
    window.location.href = '/login'
  }


  return (
    <nav className="font-sans flex flex-col lg:h-24 sm:flex-row sm:justify-between py-4 px-6 lg:px-24 bg-white shadow sm:items-center w-full">
      <div className="flex justify-between items-center">
        <a href="/#" className="lg:text-5xl text-3xl font-bold text-[#262626]">
          WoodWork
        </a>
        <button
          className="sm:hidden text-3xl text-[#262626]"
          onClick={toggleMenu}>
          &#9776;
        </button>
      </div>
      <div
        className={`sm:flex flex-col sm:flex-row sm:items-center space-x-4 sm:space-x-10 ${isMenuOpen ? "block" : "hidden"
          } mt-4 sm:mt-0`}
      >
        <a
          href="/#about"
          className="text-lg no-underline mt-2 sm:mt-0 ml-2 text-[#262626] hover:text-gray-800 font-bold transition duration-150 ease-in-out"
        >
          Nosotros
        </a>
        <a
          href="/#faq"
          className="text-lg lg:flex hidden  no-underline mt-2 sm:mt-0 ml-2 text-[#262626] hover:text-gray-800 font-bold transition duration-150 ease-in-out"
        >
          Preguntas
        </a>
        <a
          href="/#contact"
          className="text-lg no-underline mt-2 sm:mt-0 ml-2 text-[#262626] hover:text-gray-800 font-bold transition duration-150 ease-in-out"
        >
          Contacto
        </a>
        <a
          href="/login"
          className={`${user.id_user == 0 ? '' : 'hidden'} mt-2 sm:mt-0 ml-4 w-32 hover:bg-[#556B2F] bg-[#8DB600] text-white py-2 px-6  text-center font-bold rounded-lg transition duration-150 ease-in-out`}
        >
          Ingresar
        </a>
        <div className={`${user.id_user != 0 ? '' : 'hidden'} relative`}>
          <button onClick={() => setDropdown(!dropdown)} id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300" type="button">
            <span className="sr-only">Open user menu</span>
            {
              user.profilePicture?.length ? (
                <img src={user.profilePicture} alt="Previsualización" className='rounded-full w-full object-fit' />
              ) :
                <div className='w-16 h-16 rounded-full flex items-center justify-center'>
                  <div className='rounded-full w-full h-full bg-[#8DB600] text-white flex items-center justify-center text-3xl'>
                    {user?.fullName.split(' ')[0].charAt(0)}{user?.fullName.split(' ')[0].charAt(1)}
                  </div>
                </div>
            }
          </button>

          <div id="dropdownAvatar" className={`${dropdown ? 'flex' : 'hidden'} absolute left-1/2 -translate-x-1/2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 flex flex-col`}>
            <div className="px-4 py-3 text-sm text-gray-900">
              <div>{user.fullName}</div>
              <div className="font-medium truncate">{user.email}</div>
            </div>
            <ul className="flex flex-col py-2 text-sm text-gray-700" aria-labelledby="dropdownUserAvatarButton">
              <li>
                <Link className="block px-4 py-2 hover:bg-gray-100" to={`/editProfile/${user.id_user}`}>Editar perfil</Link>
              </li>
            </ul>
            <div className="py-2 w-full">
              <button onClick={logOut} className="text-start block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
