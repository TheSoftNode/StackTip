import React from 'react';
import {Mail, ArrowUpRight, Sparkles } from 'lucide-react';
import { FaTwitter, FaGithub } from 'react-icons/fa';

export const Footer: React.FC = () =>
{
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-violet-950 to-purple-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div
          className="absolute w-full h-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-violet-400" />
              <h3 className="text-xl font-bold bg-gradient-to-r from-violet-300 to-purple-300 bg-clip-text text-transparent">
                TipStack
              </h3>
            </div>
            <p className="text-gray-300/80">
              Empowering global communities through secure, instant blockchain-powered tipping.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/tipstack"
                className="group relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="h-5 w-5 text-violet-300 group-hover:text-violet-400 transition-colors" />
              </a>
              <a
                href="https://github.com/tipstack"
                className="group relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="h-5 w-5 text-violet-300 group-hover:text-violet-400 transition-colors" />
              </a>
              <a
                href="mailto:contact@tipstack.com"
                className="group relative p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <Mail className="h-5 w-5 text-violet-300 group-hover:text-violet-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Send Tips', 'FAQ', 'Pricing'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="group flex items-center text-gray-300/80 hover:text-violet-300 transition-colors"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Resources</h3>
            <ul className="space-y-3">
              {['Documentation', 'Blog', 'Support', 'Status'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="group flex items-center text-gray-300/80 hover:text-violet-300 transition-colors"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white/90">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group flex items-center text-gray-300/80 hover:text-violet-300 transition-colors"
                  >
                    {item}
                    <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TipStack. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <button className="hover:text-violet-300 transition-colors">
                Change Region
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hover:text-violet-300 transition-colors">
                English (US)
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};