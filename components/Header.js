import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

import { auth } from "../firebase/firebase";

const Header = ({ isShow }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [dropMenu, setDropMenu] = useState(false);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <header>
      <nav className="navbar">
        <img
          className="logo"
          onClick={() => router.push("/")}
          src="https://i.postimg.cc/W1PwRj4j/logo.png"
          alt="Tiktok"
        />
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search accounts and videos"
          />
          <button className="search-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>

        <div className="nav-right">
          {isShow && (
            <>
              {user && (
                <button
                  onClick={() => router.push("/pin/create")}
                  type="button"
                  className="flex items center text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center mr-2 shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Upload
                </button>
              )}
            </>
          )}
          {/* <button
            className="upload-btn flex items-center"
            onClick={() => router.push("/pin/create")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Upload
          </button> */}
          {user ? (
            <div className="flex items-center">
              <img
                onClick={logout}
                src={user?.photoURL}
                className="rounded-full w-10 cursor-pointer"
                alt="Avatar"
              />
              {/*   <p>{user?.displayName}</p> */}
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => router.push("/auth/signin")}
            >
              Log in
            </button>
          )}
          <div className="drop-down">
            {dropMenu ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => setDropMenu(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
                onClick={() => setDropMenu(true)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            )}
            {dropMenu && (
              <div className="menu z-[999]">
                <ul>
                  <li>
                    <a href="#">
                      <i className="fas fa-font fa-lg"></i> English
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="far fa-question-circle fa-lg"></i>
                      Feedbackg and help
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i className="far fa-keyboard fa-lg"></i>Keyboard
                      shortcuts
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
