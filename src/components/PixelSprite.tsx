interface PixelSpriteProps {
  shirt: string
  hair: string
  skin: string
  variant?: 'iga' | 'rani' | 'darma' | 'customer'
  className?: string
}

export function PixelSprite({
  shirt,
  hair,
  skin,
  variant = 'customer',
  className,
}: PixelSpriteProps) {
  const isIga = variant === 'iga'
  const isRani = variant === 'rani'
  const isDarma = variant === 'darma'

  return (
    <svg
      viewBox="0 0 16 24"
      className={`pixel-sprite${className ? ` ${className}` : ''}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {isRani ? (
        <>
          <rect x="3" y="4" width="1" height="8" fill={hair} />
          <rect x="12" y="4" width="1" height="8" fill={hair} />
          <rect x="4" y="11" width="2" height="3" fill={hair} />
          <rect x="10" y="11" width="2" height="3" fill={hair} />
        </>
      ) : null}

      <rect x="4" y="5" width="8" height="8" fill="#f8d9b8" opacity=".22" />
      <rect x="4" y="4" width="8" height="6" fill={skin} />
      <rect x="5" y="3" width="6" height="2" fill={hair} />
      <rect x="4" y="4" width="1" height="3" fill={hair} />
      <rect x="11" y="4" width="1" height="3" fill={hair} />
      {isDarma ? (
        <>
          <rect x="5" y="5" width="2" height="2" fill="#2f3a48" />
          <rect x="9" y="5" width="2" height="2" fill="#2f3a48" />
          <rect x="7" y="5" width="2" height="1" fill="#2f3a48" />
          <rect x="5" y="5" width="6" height="1" fill="#2f3a48" opacity=".35" />
        </>
      ) : (
        <>
          <rect x="6" y="6" width="1" height="1" fill="#2b2f36" />
          <rect x="9" y="6" width="1" height="1" fill="#2b2f36" />
        </>
      )}
      <rect x="7" y="8" width="2" height="1" fill="#9b5e4a" />
      <rect x="7" y="9" width="2" height="1" fill={skin} />

      <rect x="4" y="10" width="8" height="6" fill={shirt} />
      <rect x="7" y="10" width="2" height="1" fill="#fffdf5" opacity=".7" />
      <rect x="4" y="15" width="8" height="1" fill="#1f2936" opacity=".24" />
      <rect x="3" y="10" width="1" height="6" fill={shirt} />
      <rect x="12" y="10" width="1" height="6" fill={shirt} />
      <rect x="3" y="16" width="1" height="1" fill={skin} />
      <rect x="12" y="16" width="1" height="1" fill={skin} />

      <rect x="4" y="16" width="3" height="5" fill="#2f3a48" />
      <rect x="9" y="16" width="3" height="5" fill="#2f3a48" />
      <rect x="3" y="21" width="4" height="2" fill="#1f2936" />
      <rect x="9" y="21" width="4" height="2" fill="#1f2936" />
      <rect x="3" y="22" width="4" height="1" fill="#151b24" />
      <rect x="9" y="22" width="4" height="1" fill="#151b24" />

      {isIga ? (
        <>
          <rect x="4" y="2" width="8" height="1" fill="#1e2936" />
          <rect x="4" y="3" width="1" height="2" fill="#1e2936" />
          <rect x="11" y="3" width="1" height="2" fill="#1e2936" />
          <rect x="3" y="5" width="1" height="2" fill="#1e2936" />
          <rect x="12" y="5" width="1" height="2" fill="#1e2936" />
          <rect x="12" y="7" width="1" height="2" fill="#1e2936" />
          <rect x="13" y="7" width="1" height="1" fill="#0f766e" />
        </>
      ) : null}

      {variant === 'customer' ? (
        <>
          <rect x="11" y="11" width="2" height="4" fill={shirt} />
          <rect x="12" y="14" width="1" height="1" fill={skin} />
        </>
      ) : null}
    </svg>
  )
}
