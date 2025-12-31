import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import ExternalLink from "./ExternalLink";

type HeaderProps = {
  homePage: boolean;
};

function Header({ homePage }: HeaderProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [mobileScreen, setMobileScreen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  useEffect(() => {
    const paddingTop = () => {
      if (window.innerWidth >= 640) {
        document.body.style.paddingTop = "185px";
        setMobileScreen(false);
      } else {
        setMobileScreen(true);
        document.body.style.paddingTop = "121px";
      }
      if (homePage) {
        document.body.style.paddingTop = "0px";
      }
    };

    window.addEventListener("resize", paddingTop);
    paddingTop();

    return () => window.removeEventListener("resize", paddingTop);
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
      }  z-51 p-7`}
    >
      <div
        className="flex gap-5 items-center text-left  z-100 cursor-pointer w-60 h-16 sm:h-32"
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
        <div className="text-white text-xl sm:text-2xl">
          {isSideBarOpen ? "ZAVŘÍT MENU" : "MENU"}
        </div>
      </div>
      <div
        className={`absolute ${
          mobileScreen || homePage
            ? "right-[6%] sm:right-[5%] 2xl:right-[3%] 2xl:translate-x-18 2xl:h-36 2xl:w-36 sm:translate-x-15 sm:h-30 sm:w-30 mr-10 translate-x-13 h-26 w-26"
            : "right-[50%] translate-x-22 h-44 w-44"
        } `}
      >
        <NavLink to={"/"}>
          <img
            className="w-full h-full object-cover"
            src="/icons/logo.svg"
            alt="car-wash-logo"
          />
        </NavLink>
      </div>
      {!homePage && !mobileScreen && (
        <div
          className={`w-60 h-16 sm:h-32 flex justify-center items-center gap-5 ${
            isSideBarOpen ? "hidden sm:flex" : ""
          }`}
        >
          {!homePage && !mobileScreen && (
            <>
              <ExternalLink href="https://www.instagram.com/f.x.carwash/">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 invert"
                  src="/icons/instagram-icon.svg"
                  alt="instagram-icon"
                />
              </ExternalLink>
              <ExternalLink href="https://facebook.com/61585347136984/">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 invert"
                  src="/icons/facebook-icon.svg"
                  alt="facebook-icon"
                />
              </ExternalLink>
              <ExternalLink href="https://www.youtube.com/@F.X.Carwash">
                <img
                  className="w-8 h-8 sm:w-10 sm:h-10 invert"
                  src="/icons/youtube-icon.svg"
                  alt="youtube-icon"
                />
              </ExternalLink>
            </>
          )}
        </div>
      )}

      {isSideBarOpen && (
        <div className="fixed top-0 left-0 w-full sm:w-1/2 bottom-0 z-99 bg-black flex justify-center items-center flex-col">
          <div className="flex-1"></div>
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
          <div className="flex-1 w-full flex justify-center items-center">
            <Link
              className="hover:text-gray-500 text-xl md:text-2xl xl:text-3xl contactText border-2 p-2"
              to="/login"
            >
              E-SHOP
            </Link>
          </div>
        </div>
      )}

      {isSideBarOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-98"></div>
      )}
    </header>
  );
}
export default Header;
