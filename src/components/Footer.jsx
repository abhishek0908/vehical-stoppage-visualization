// Footer.js

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-500 py-4 w-full">
      <div className="container mx-auto px-4 text-center text-white">
        <p>Created by: Abhishek Udiya</p>
        <div className="flex justify-center items-center mt-2 mb-12">
          <a
            href="https://www.linkedin.com/in/abhishek-udiya-87452618b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 mr-4"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/abhishek0908"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200 mr-4"
          >
            GitHub
          </a>
          <a
            href="https://drive.google.com/file/d/1YJHQ99hRwbdpvSEx9N_q3kdmx2UK_T-6/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-200"
          >
            Resume
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
