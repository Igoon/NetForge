import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react'
import type { PacketEdge } from '../types'

export function PacketEdgeView({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<PacketEdge>) {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })
  const active = data?.active === true

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke: active ? '#0f766e' : '#5b6470',
          strokeWidth: active ? 4.6 : 4,
          strokeLinecap: 'round',
        }}
      />
      <path
        d={path}
        fill="none"
        stroke={active ? '#99f6e4' : '#cbd5e1'}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={active ? 0.95 : 0.65}
        pointerEvents="none"
      />
      {active ? (
        <circle r="4.4" fill="#f97316" stroke="#fff7ed" strokeWidth="1" className="packet-dot">
          <animateMotion
            dur="1.25s"
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ) : null}
    </>
  )
}
