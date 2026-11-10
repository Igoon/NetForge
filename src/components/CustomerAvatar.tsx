import type { CustomerProfile } from '../data/customers'

interface CustomerAvatarProps {
  customer: CustomerProfile
  className?: string
}

export function CustomerAvatar({
  customer,
  className,
}: CustomerAvatarProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`customer-avatar${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="56" fill={`${customer.accent}18`} />
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke={customer.accent}
        strokeOpacity=".3"
      />
      <path d="M24 112c3-22 15-35 36-35s33 13 36 35" fill={customer.shirt} />
      <path d="M50 78h20v10c0 8-20 8-20 0Z" fill={customer.skin} />
      <ellipse cx="60" cy="54" rx="27" ry="29" fill={customer.skin} />
      <path
        d="M33 50c0-19 11-28 27-28s27 9 27 28c-8-8-15-12-27-12s-19 4-27 12Z"
        fill={customer.hair}
      />
      <circle cx="50" cy="55" r="2.8" fill="#2b2f36" />
      <circle cx="70" cy="55" r="2.8" fill="#2b2f36" />
      <path
        d="M54 65c3 2 9 2 12 0"
        fill="none"
        stroke="#9b5e4a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="98" r="4" fill="#fffdf9" opacity=".85" />
      <path
        d="M56 98h8"
        stroke={customer.shirt}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M43 98h34" stroke={customer.shirt} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
