export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`
        bg-background-light rounded-lg p-6 border border-background-light
        ${hover ? 'transition-all duration-200 hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(100,23,163,0.8)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
