import type { DeviceType } from '../types'

interface DeviceGlyphProps {
  type: DeviceType
  className?: string
}

export function DeviceGlyph({ type, className }: DeviceGlyphProps) {
  return (
    <svg
      viewBox="0 0 80 56"
      className={`device-glyph${className ? ` ${className}` : ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="#39424f"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {type === 'pc' ? (
          <>
            <ellipse cx="39" cy="51" rx="29" ry="2.4" fill="#1e2936" opacity=".08" stroke="none" />
            <rect x="6" y="7" width="37" height="27" rx="3" fill="#e3e5e8" />
            <rect x="9" y="10" width="31" height="20" rx="1.5" fill="#2f3947" />
            <rect x="11" y="12" width="27" height="16" fill="currentColor" opacity=".26" stroke="none" />
            <rect x="23" y="34" width="4" height="6" fill="#c9ced5" />
            <rect x="15" y="40" width="20" height="3" rx="1.5" fill="#c9ced5" />
            <rect x="48" y="9" width="23" height="37" rx="3" fill="#e3e5e8" />
            <rect x="51" y="13" width="17" height="3" rx="1" fill="#2f3947" stroke="none" />
            <circle cx="53" cy="21" r="1.6" fill="currentColor" stroke="none" />
            <rect x="51" y="28" width="17" height="2" fill="#c9ced5" stroke="none" />
            <rect x="51" y="34" width="17" height="2" fill="#c9ced5" stroke="none" />
            <rect x="51" y="40" width="10" height="2" fill="#c9ced5" stroke="none" />
          </>
        ) : null}

        {type === 'laptop' ? (
          <>
            <ellipse cx="40" cy="50" rx="31" ry="2.4" fill="#1e2936" opacity=".08" stroke="none" />
            <path d="M14 8h44a3 3 0 0 1 3 3v23H11V11a3 3 0 0 1 3-3Z" fill="#e3e5e8" />
            <rect x="14" y="11" width="44" height="20" rx="1.5" fill="#2f3947" />
            <rect x="16" y="13" width="40" height="16" fill="currentColor" opacity=".24" stroke="none" />
            <path d="M6 35h60l4 8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="#ced3d9" />
            <path d="M12 38h48" stroke="#89929d" strokeWidth="1" />
            <path d="M26 43h20" stroke="#89929d" strokeWidth="1" />
            <circle cx="62" cy="40" r="1.3" fill="currentColor" stroke="none" />
          </>
        ) : null}

        {type === 'printer' ? (
          <>
            <ellipse cx="37" cy="50" rx="31" ry="2.4" fill="#1e2936" opacity=".08" stroke="none" />
            <path d="M23 7h31v14H23Z" fill="#f7f5ef" />
            <path d="M26 10h8M26 14h18" stroke="#a7afba" strokeWidth="1" />
            <rect x="8" y="18" width="56" height="23" rx="3" fill="#e3e5e8" />
            <rect x="8" y="18" width="56" height="5" rx="2" fill="#ced3d9" />
            <rect x="14" y="27" width="29" height="3" rx="1" fill="#2f3947" stroke="none" />
            <rect x="14" y="33" width="17" height="2" rx="1" fill="#a7afba" stroke="none" />
            <circle cx="56" cy="27" r="2" fill="currentColor" stroke="none" />
            <path d="M23 41h39v9H23Z" fill="#f7f5ef" />
            <path d="M27 44h27M27 47h20" stroke="#a7afba" strokeWidth="1" />
          </>
        ) : null}

        {type === 'switch' ? (
          <>
            <ellipse cx="39" cy="46" rx="31" ry="2.3" fill="#1e2936" opacity=".08" stroke="none" />
            <rect x="6" y="16" width="61" height="24" rx="3" fill="#e3e5e8" />
            <rect x="6" y="16" width="61" height="6" rx="2" fill="#ced3d9" />
            <rect x="11" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="19" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="27" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="35" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="43" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="51" y="27" width="6" height="7" rx="1" fill="#2f3947" stroke="none" />
            <circle cx="12.5" cy="23.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="20.5" cy="23.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="28.5" cy="23.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="60" cy="23.5" r="1.5" fill="currentColor" stroke="none" />
            <path d="M60 31h3v3h-3z" fill="#a7afba" stroke="none" />
          </>
        ) : null}

        {type === 'router' ? (
          <>
            <ellipse cx="40" cy="47" rx="32" ry="2.4" fill="#1e2936" opacity=".08" stroke="none" />
            <path d="M18 19 13 6" strokeWidth="2.4" />
            <path d="M62 19 67 6" strokeWidth="2.4" />
            <circle cx="12.5" cy="4.5" r="2" fill="currentColor" stroke="none" />
            <circle cx="67.5" cy="4.5" r="2" fill="currentColor" stroke="none" />
            <rect x="8" y="18" width="64" height="23" rx="3" fill="#e3e5e8" />
            <rect x="8" y="18" width="64" height="6" rx="2" fill="#ced3d9" />
            <rect x="13" y="28" width="7" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="22" y="28" width="7" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="31" y="28" width="7" height="7" rx="1" fill="#2f3947" stroke="none" />
            <rect x="40" y="28" width="7" height="7" rx="1" fill="#2f3947" stroke="none" />
            <circle cx="56" cy="24" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="61" cy="24" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="66" cy="24" r="1.6" fill="currentColor" stroke="none" />
            <path d="M53 30h15M53 34h9" stroke="#a7afba" strokeWidth="1" />
          </>
        ) : null}

        {type === 'firewall' ? (
          <>
            <ellipse cx="40" cy="47" rx="32" ry="2.4" fill="#1e2936" opacity=".08" stroke="none" />
            <rect x="7" y="17" width="66" height="24" rx="3" fill="#e3e5e8" />
            <rect x="7" y="17" width="66" height="6" rx="2" fill="#ced3d9" />
            <path d="M40 24l9 3v6c0 5-4 9-9 11-5-2-9-6-9-11v-6Z" fill="currentColor" opacity=".18" stroke="currentColor" />
            <path d="m36 33 3 3 5-6" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 24h8M13 28h8M13 32h8M59 24h8M59 28h8M59 32h8" stroke="#2f3947" strokeWidth="1.4" />
            <circle cx="66" cy="36" r="1.4" fill="currentColor" stroke="none" />
          </>
        ) : null}

        {type === 'accesspoint' ? (
          <>
            <ellipse cx="40" cy="49" rx="27" ry="3" fill="#1e2936" opacity=".08" stroke="none" />
            <path d="M29 17a17 17 0 0 1 22 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M23 10a26 26 0 0 1 34 0" fill="none" stroke="currentColor" strokeWidth="1.8" opacity=".65" />
            <ellipse cx="40" cy="35" rx="25" ry="9" fill="#ced3d9" />
            <ellipse cx="40" cy="32" rx="25" ry="9" fill="#e3e5e8" />
            <ellipse cx="40" cy="31" rx="17" ry="5" fill="#f2f0e9" />
            <circle cx="40" cy="31" r="2.2" fill="currentColor" stroke="none" />
            <rect x="37" y="41" width="6" height="6" fill="#c9ced5" />
            <path d="M32 49h16" stroke="#a7afba" strokeWidth="1.4" />
          </>
        ) : null}

        {type === 'server' ? (
          <>
            <ellipse cx="40" cy="51" rx="24" ry="2.3" fill="#1e2936" opacity=".08" stroke="none" />
            <rect x="21" y="4" width="38" height="46" rx="3" fill="#e3e5e8" />
            <rect x="24" y="8" width="32" height="10" rx="1.5" fill="#2f3947" />
            <rect x="24" y="21" width="32" height="10" rx="1.5" fill="#2f3947" />
            <rect x="24" y="34" width="32" height="10" rx="1.5" fill="#2f3947" />
            <path d="M28 11h8M28 14h13M28 24h8M28 27h13M28 37h8M28 40h13" stroke="#a7afba" strokeWidth="1" />
            <circle cx="50" cy="11" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="50" cy="24" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="50" cy="37" r="1.4" fill="currentColor" stroke="none" />
            <rect x="25" y="50" width="6" height="3" fill="#c9ced5" stroke="none" />
            <rect x="49" y="50" width="6" height="3" fill="#c9ced5" stroke="none" />
          </>
        ) : null}
      </g>
    </svg>
  )
}
