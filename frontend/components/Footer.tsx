"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Bulk<span className="text-orange-500">Bite</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Empowering street food vendors through collaborative bulk purchasing and community building.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/role-selection"
                  className="text-gray-300 hover:text-orange-500 transition-colors duration-200"
                >
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* For Vendors */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Vendors</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Browse Products
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Join Groups
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Track Orders
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors duration-200">
                  Savings Calculator
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-gray-300">support@bulkbite.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-orange-500" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-orange-500 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Food Street
                  <br />
                  Business District
                  <br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© 2024 BulkBite. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
