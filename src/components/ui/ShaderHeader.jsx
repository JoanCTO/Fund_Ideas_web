"use client";

import { Button } from "./Button";

export default function ShaderHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center">
        <div className="glass flex h-12 w-12 items-center justify-center rounded-3xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 stroke-violet-400"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m0-14.142l1.414 1.414m11.314 11.314l1.414 1.414" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Features
        </a>
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Pricing
        </a>
        <a
          href="#"
          className="rounded-full px-3 py-2 text-xs font-light text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
        >
          Docs
        </a>
      </nav>

      {/* Login Button Group with Arrow */}
      <div
        id="gooey-btn"
        className="group relative flex items-center"
        style={{ filter: "url(#gooey-filter)" }}
      >
        <button className="absolute right-0 z-0 flex h-8 -translate-x-10 cursor-pointer items-center justify-center rounded-full bg-white px-2.5 py-2 text-xs font-normal text-black transition-all duration-300 group-hover:-translate-x-19 hover:bg-white/90">
          <svg
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17L17 7M17 7H7M17 7V17"
            />
          </svg>
        </button>
        <button className="z-10 flex h-8 cursor-pointer items-center rounded-full bg-white px-6 py-2 text-xs font-normal text-black transition-all duration-300 hover:bg-white/90">
          Login
        </button>
      </div>
    </header>
  );
}
