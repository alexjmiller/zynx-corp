import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `text-sm transition-colors ${isActive ? '!text-text' : '!text-text-muted hover:!text-text'}`

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-background-light">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-5xl font-bold !text-text hover:!text-text-muted transition-colors">
          zynx
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-muted hover:text-text transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-background-light">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
            <NavLink to="/services" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Services</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}
