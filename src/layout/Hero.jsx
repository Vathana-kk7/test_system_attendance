import { Book } from 'lucide-react'
import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import { NavLink } from 'react-router-dom';

function Hero({ onToggleMenu }) {
    useEffect(() => {
      AOS.init({ duration: 1000 }); // animation duration
    }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm ">
      {/* Left: Menu button */}
      <button
        onClick={onToggleMenu}
        aria-label="Toggle menu"
        className="p-2 rounded-md hover:bg-gray-100 transition"
      >
        <Book className="w-6 h-6 text-gray-700 cursor-pointer " data-aos="fade-down"/>
      </button>

      {/* Right: Auth buttons */}
      <div className="flex items-center gap-4 ">
       <NavLink to="/login">
        <button className="cursor-pointer px-5 py-2 text-sm font-semibold text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition "data-aos="fade-right">
            Login
        </button>
        </NavLink>
        <NavLink to="/register">
          <button className="px-5 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition cursor-pointer" data-aos="fade-left">
            Register
          </button>
        </NavLink>
      </div>

    </header>
  )
}

export default Hero