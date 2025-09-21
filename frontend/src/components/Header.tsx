import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ExternalLink from "./ExternalLink";

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
  }, []);

  useEffect(() => {
    if (isSideBarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSideBarOpen]);

  return (
    <header
      className={`absolute top-0 left-0 w-full flex flex-row justify-between items-center ${
        homePage ? "bg-none" : "header-color  border-b-[1px] border-gray-500"
      }  z-51 p-5`}
    >
      <div
        className="flex gap-5 items-center  z-100 cursor-pointer w-60 h-32"
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
          {isSideBarOpen ? "ZAVŘÍT MENU" : "MENU"}
        </div>
      </div>
      {!homePage && (
        <div className="w-32 h-32 hidden sm:block">
          <NavLink to={"/"}>
            <img
              className="w-full h-full object-cover"
              src="/car-wash-logo.png"
              alt="car-wash-logo"
            />
          </NavLink>
        </div>
      )}
      <div className="w-60 h-32 flex justify-center items-center gap-5">
        <ExternalLink href="https://instagram.com">
          <img
            className="w-10 h-10 invert"
            src="src/assets/instagram-icon-2.svg"
            alt="instagram-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://facebook.com">
          <img
            className="w-10 h-10 invert"
            src="src/assets/facebook-icon-2.svg"
            alt="facebook-icon"
          />
        </ExternalLink>
        <ExternalLink href="https://youtube.com">
          <img
            className="w-10 h-10 invert"
            src="src/assets/youtube-icon-2.svg"
            alt="youtube-icon"
          />
        </ExternalLink>
      </div>
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
                ÚVOD
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
                O NÁS
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
                NOVINKY
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/nabidka"
              >
                NABÍDKA
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  `${
                    isActive ? "header-navlink-active" : "text-white"
                  } header-navlink`
                }
                to="/firmy"
              >
                FIRMY
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
                KONTAKT
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
