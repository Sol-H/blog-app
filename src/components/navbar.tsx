"use client";
import { useDarkToggle } from "@/app/handleDarkMode";
import { MdDarkMode, MdLightMode, MdStickyNote2 } from "react-icons/md";
import { useEffect, useState } from "react";
import LoginButton from "@/components/loginButton";

interface NavLinkProps {
  text: string;
  href: string;
  classes?: string;
}

function NavLink({ text, href, classes }: NavLinkProps) {
  const allClasses:string = `text-gray-900 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white ${classes}`;
  return (
    <a href={href} className={ allClasses }>
      {text}
    </a>
  );
}

export default function Navbar() {
  useDarkToggle();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDarkMode(theme === 'dark');
  }, []);

  function toggleDarkMode() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  }

  return (
    <nav className="p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="grid grid-cols-3 grid-rows-1">
          <div className="flex justify-end pr-2"><MdStickyNote2 className="h-full w-max right-0 dark:text-gray-300 text-gray-900" /></div>
          <div className="text-lg font-bold col-span-2 hover:cursor-pointer" onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/`}>EasyBlog</div>
        </div>
        <div className="flex space-x-2 md:space-x-4">
          <NavLink href={`${process.env.NEXT_PUBLIC_API_URL}/`} classes="scale-0 md:scale-100" text="Home" />
          <LoginButton />
          <button
            className="dark:text-gray-300 dark:hover:text-white text-gray-900 hover:text-gray-800 pl-4"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
          </button>
        </div>
      </div>
    </nav>
  );
}