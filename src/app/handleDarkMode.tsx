"use client";
import { useEffect } from "react";

export function useDarkToggle() {
  useEffect(() => {
    // Check if dark mode is enabled in local storage
    const isDarkMode = localStorage.getItem('theme') === 'dark';

    // Apply the dark class to the HTML element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    console.log('Dark mode is enabled:', isDarkMode);
  }, []);
}