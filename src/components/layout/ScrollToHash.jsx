import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't scroll to URL hash anchors on navigation. This
// component watches location and scrolls to the matching element.
//
// We retry a few times because on mobile, fonts / images / async-loaded
// content can shift layout after the initial scroll, leaving the target
// not quite at the top. Multiple staggered attempts settle on the right
// position regardless of how slow the page renders.
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))

    const scrollToTarget = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Initial scroll on the next frame, then re-scroll after layout has had
    // time to settle (fonts loaded, images sized, etc).
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
