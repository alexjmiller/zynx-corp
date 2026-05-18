export default function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`
        bg-background-light rounded-lg p-6 border border-background-light
        ${hover ? 'transition-all duration-200 motion-reduce:transition-none hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(100,23,163,0.8)] motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
