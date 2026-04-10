import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import ExternalLink from "./ExternalLink";
import CartIcon from "./CartIcon";

type HeaderProps = {
  homePage: boolean;
  account?: boolean;
  logo?: boolean;
  withoutPadding?: boolean;
  takePosition?: boolean;
};

function Header({
  homePage,
  account,
  logo = true,
  withoutPadding,
  takePosition,
}: HeaderProps) {
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
      if (homePage || withoutPadding) {
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
    <div>
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
        {((!logo && !mobileScreen) || logo) && (
          <div
            className={`absolute ${
              mobileScreen || homePage
                ? "sm:h-44 sm:w-44 h-25 w-25 right-[0%] mr-4"
                : "right-[50%] translate-x-22 h-44 w-44"
            } `}
          >
            <NavLink to={"/"}>
              <img
                className={`w-full h-full p-2 py-4 sm:p-4 sm:py-8 object-fit `}
                src="/icons/logo_homepage.png"
                alt="car-wash-logo"
              />
            </NavLink>
          </div>
        )}

        {account && (
          <div className="flex items-center gap-3">
            <CartIcon />
            <Link
              to="/profil"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all"
              aria-label="Profil"
            >
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
          </div>
        )}
        {!account && !homePage && !mobileScreen && (
          <div
            className={`w-60 h-16 sm:h-32 flex justify-end items-center gap-5 ${
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

              <li>
                <NavLink
                  className={({ isActive }) =>
                    `${
                      isActive ? "header-navlink-active" : "text-white"
                    } header-navlink`
                  }
                  to="/moje-karty"
                >
                  FX KARTY
                </NavLink>
              </li>
            </ul>
          </div>
        )}

        {isSideBarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-98"></div>
        )}
      </header>
      {takePosition && (
        <div
          className={`${mobileScreen ? "h-[121px]" : "h-[185px]"} w-full`}
        ></div>
      )}
    </div>
  );
}
export default Header;
