import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background-light border-t border-background py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-3xl font-normal !text-text hover:!text-text-muted transition-colors">
              zynx
            </Link>
            <p className="mt-4 text-sm text-text-muted">
              Modern software solutions for small and medium businesses.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-normal text-text mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm !text-text-muted hover:!text-text transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm !text-text-muted hover:!text-text transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm !text-text-muted hover:!text-text transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm !text-text-muted hover:!text-text transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-normal text-text mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>hello@zynx.co</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background">
          <p className="text-sm text-text-muted text-center">
            © {currentYear} Zynx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
