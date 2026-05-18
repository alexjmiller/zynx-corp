import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't scroll to URL hash anchors on navigation (or on
// hash-only changes). This component watches location and scrolls to the
// element with the matching id when the hash changes.
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    // Wait one frame so the page has rendered before we look up the element.
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(raf)
  }, [hash, pathname])

  return null
}
