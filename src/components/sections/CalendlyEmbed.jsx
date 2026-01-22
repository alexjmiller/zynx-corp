import { useEffect } from 'react'

export default function CalendlyEmbed({ url = 'https://calendly.com/alexander-miller' }) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: '320px', height: '700px' }}
    />
  )
}
