import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't manage scroll position on navigation. This handles
// two cases:
//   - URL has a hash → scroll to the matching element (with retries to
//     survive layout shifts on mobile while fonts/images load).
//   - URL has no hash → scroll to top, so /privacy and similar always
//     open at the heading rather than wherever the previous page left
//     the viewport.
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))

    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const raf = requestAnimationFrame(scrollToTarget)
    const t1 = setTimeout(scrollToTarget, 150)
    const t2 = setTimeout(scrollToTarget, 400)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [hash, pathname])

  return null
}
