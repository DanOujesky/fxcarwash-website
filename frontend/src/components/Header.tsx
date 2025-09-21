import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

type HeaderProps = {
  homePage: boolean;
};

function Header({ homePage }: HeaderProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  useEffect(() => {
    if (!homePage) {
      document.body.style.paddingTop = "169px";
    } else {
      document.body.style.paddingTop = "0px";
    }
  }, [homePage]);

  useEffect(() => {
    let scrollY = 0;

    if (isSideBarOpen) {
      scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      scrollY = Math.abs(parseInt(document.body.style.top || "0"));
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }

    return () => {
      const currentScrollY = Math.abs(parseInt(document.body.style.top || "0"));
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, currentScrollY);
    };
  }, [isSideBarOpen]);

  return (
    <header
      className={`absolute top-0 left-0 w-full flex flex-row justify-between items-center ${
        homePage ? "bg-none" : "header-color  border-b-[1px] border-gray-500"
      }  z-51 p-5`}
    >
      <div
        className="flex gap-5 items-center  z-100 cursor-pointer w-50 h-32"
        onClick={toggleSideBar}
      >
        <div className="flex flex-col justify-between w-10 h-6">
          <span
            className={`block h-1 bg-white transform transition duration-300 ${
              isSideBarOpen ? "rotate-45 translate-y-3" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-white transition duration-300 ${
              isSideBarOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-white transform transition duration-300 ${
              isSideBarOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </div>
        <div className="text-white text-2xl">
          {isSideBarOpen ? "Zavřít Menu" : "Menu"}
        </div>
      </div>
      {!homePage && (
        <div className="w-50 h-32 hidden sm:block">
          <NavLink to={"/"}>
            <img
              className="w-full h-full"
              src="/car_wash_logo.svg"
              alt="car-wash-logo"
            />
          </NavLink>
        </div>
      )}
      <div className="w-50 h-32"></div>
      {isSideBarOpen && (
        <div className="fixed top-0 left-0 w-full sm:w-1/2 bottom-0 z-99 bg-black flex justify-center items-center">
          <ul className="flex flex-col gap-4">
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/"
              >
                Úvod
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/o-nas"
              >
                O Nás
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/novinky"
              >
                Novinky
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/pro-firmy"
              >
                Pro Firmy
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/kontakt"
              >
                Kontakt
              </NavLink>
            </li>
          </ul>
        </div>
      )}
      {isSideBarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-98"></div>
      )}
    </header>
  );
}
export default Header;
