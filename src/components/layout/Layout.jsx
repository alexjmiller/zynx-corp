import Header from './Header'
import Footer from './Footer'
import ScrollToHash from './ScrollToHash'
import ChatWidget from '../sections/ChatWidget'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToHash />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
