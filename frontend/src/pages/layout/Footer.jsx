import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-indigo-500 text-white mt-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">MyApp</h2>
            <p className="text-indigo-200 text-sm mt-2">
              Manage your posts and products with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-indigo-200 hover:text-white transition">Home</Link></li>
              <li><Link to="/product/create" className="text-indigo-200 hover:text-white transition">Create Post</Link></li>
              <li><Link to="/cart" className="text-indigo-200 hover:text-white transition">Cart</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link  className="text-indigo-200 hover:text-white transition">About</Link></li>
              <li><Link  className="text-indigo-200 hover:text-white transition">Contact</Link></li>
              <li><Link  className="text-indigo-200 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex gap-4">
              <Link href="#" className="text-indigo-200 hover:text-white transition" aria-label="Facebook"><FaFacebook size={20} /></Link>
              <Link href="#" className="text-indigo-200 hover:text-white transition" aria-label="Twitter"><FaTwitter size={20} /></Link>
              <Link href="#" className="text-indigo-200 hover:text-white transition" aria-label="Instagram"><FaInstagram size={20} /></Link>
              <Link href="#" className="text-indigo-200 hover:text-white transition" aria-label="LinkedIn"><FaLinkedin size={20} /></Link>
              <Link href="#" className="text-indigo-200 hover:text-white transition" aria-label="GitHub"><FaGithub size={20} /></Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-700 mt-8 pt-6 text-center text-sm text-indigo-200">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;