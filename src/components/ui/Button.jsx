import { Link } from 'react-router-dom'

export default function Button({ children, to, href, variant = 'primary', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 text-sm font-normal rounded transition-all duration-200 hover:-translate-y-1 hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(100,23,163,0.8)]'

  const variants = {
    primary: 'bg-accent !text-white hover:!text-white',
    secondary: 'bg-background-light !text-text hover:!text-text border border-background-light',
    outline: 'border border-accent !text-accent hover:!text-accent',
  }

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={combinedClassName} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={combinedClassName} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  )
}
