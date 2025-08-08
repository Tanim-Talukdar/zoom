import React, { useContext } from 'react';
import { motion } from "framer-motion";
import { fadeIn, slideIn, slideRotate, textVariant, zoomIn } from "../utils/motion";
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // ✅ Auth context import

export default function LandingPage() {
  const { handleLogout, userData } = useContext(AuthContext); // ✅ Access logout and user info

  return (
    <div
      className="text-white h-screen w-screen bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      {/* Nav Section */}
      <motion.nav 
        variants={fadeIn('down', 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex justify-between items-center px-6 py-4"
      >
        <motion.div 
          variants={fadeIn('right', 0.3)}
          className="flex items-center gap-1 cursor-pointer"
        >
          <motion.p 
            whileHover={{ scale: 1.1 }}
            className="font-sans italic text-violet-300 text-2xl sm:text-xl md:text-2xl"
          >
            Sweet Home
          </motion.p>
        </motion.div>

        {/* ✅ Conditional Login/Register or Logout */}
        <div>
          {userData ? (
            <button 
              onClick={handleLogout}
              className="p-2 bg-red-600 rounded transition duration-400 hover:drop-shadow-lg cursor-pointer hover:bg-transparent hover:border-2 hover:border-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/auth" className="p-2 mx-2 bg-violet-600 rounded transition duration-400 hover:drop-shadow-lg hover:bg-transparent hover:border-2 hover:border-violet-600">
                Login
              </Link>
              <Link to="/auth" className="p-2 bg-violet-600 rounded transition duration-400 hover:drop-shadow-lg hover:bg-transparent hover:border-2 hover:border-violet-600">
                Register
              </Link>
            </>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container h-[88vh] mx-auto px-6 py-10 flex flex-col-reverse md:flex-row items-center justify-between">
        <motion.div
          variants={fadeIn('right', 0.4)}
          initial="hidden"
          whileInView="show"
          className="text-center md:text-left"
        >
          <motion.p
            variants={textVariant(0.4)}
            className="text-3xl sm:text-4xl md:text-5xl font-serif leading-snug"
          >
            <span className="text-violet-400">Connect</span> With your loved Ones
            
          </motion.p>
          <br />
          <motion.p
            variants={zoomIn(0.8)}
            className="text-2xl font-serif leading-snug"
          >
            Cover a distance by Sweet Home
            
          </motion.p>
          <br />
          <Link to="/auth" className="p-2 bg-violet-600 rounded transition duration-400 hover:drop-shadow-lg hover:bg-transparent hover:border-2 hover:border-violet-600">
              Get Started
            </Link>
        </motion.div>

        <motion.div
          variants={fadeIn('left', 0.4)}
          initial="hidden"
          whileInView="show"
          className="flex justify-center mt-6 md:mt-0"
        >
          <img src="/mobile.png" alt="mobile" className="w-72 sm:w-96 md:w-160" />
        </motion.div>
      </div>
    </div>
  );
}
