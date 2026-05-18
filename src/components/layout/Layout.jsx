import Header from './Header'
import Footer from './Footer'
import ScrollToHash from './ScrollToHash'
import ChatWidget from '../sections/ChatWidget'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <ScrollToHash />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
