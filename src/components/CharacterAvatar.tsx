interface CharacterAvatarProps {
  className?: string
}

export function CharacterAvatar({ className }: CharacterAvatarProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`character-avatar${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="56" fill="#e6f2ef" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="#0f766e" strokeOpacity=".22" />
      <path
        d="M28 110c2-20 14-32 32-32s30 12 32 32"
        fill="#0f766e"
      />
      <path
        d="M50 78h20v10c0 8-20 8-20 0Z"
        fill="#f2c6a0"
      />
      <ellipse cx="60" cy="54" rx="27" ry="29" fill="#f2c6a0" />
      <path
        d="M33 51c0-20 11-29 27-29s27 9 27 29c-6-5-9-13-10-18-6 7-17 10-29 10-5 0-9 2-15 8Z"
        fill="#2b2f36"
      />
      <path
        d="M36 46c-4 7-5 15-2 22M84 46c4 7 5 15 2 22"
        fill="none"
        stroke="#2b2f36"
        strokeWidth="5"
        strokeLinecap="round"
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
      <path
        d="M36 47c-6 1-9 7-8 14M84 47c6 1 9 7 8 14"
        fill="none"
        stroke="#0f766e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M28 61c-4 0-6 4-4 7s7 2 7-2"
        fill="none"
        stroke="#0f766e"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="80" y="57" width="5" height="9" rx="2.5" fill="#0f766e" />
      <path d="M43 98h34" stroke="#0b5f59" strokeWidth="3" strokeLinecap="round" />
      <rect x="67" y="96" width="14" height="9" rx="2" fill="#fde68a" />
      <path d="M70 100h8M70 103h5" stroke="#8a5a12" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}
