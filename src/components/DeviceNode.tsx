import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { CSSProperties } from 'react'
import { DEVICES } from '../data/devices'
import type { DeviceNode } from '../types'
import { DeviceGlyph } from './DeviceGlyph'

export function DeviceNodeCard({ data, selected }: NodeProps<DeviceNode>) {
  const spec = DEVICES[data.deviceType]
  const { config } = data

  return (
    <div
      className={`device-node${selected ? ' is-selected' : ''}`}
      style={{ '--accent': spec.color } as CSSProperties}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="device-port device-port-in"
      />
      <span className="device-visual">
        <DeviceGlyph type={data.deviceType} />
      </span>
      <div className="device-copy">
        <div className="device-topline">
          <span className="device-type">{spec.label}</span>
          {data.fixed ? <span className="device-lock">LAB</span> : null}
        </div>
        <div className="device-name">{data.label}</div>
        <div className="device-meta">
          <span>{config.ip.trim() || 'Belum ada IP'}</span>
          {config.vlan.trim() ? <span>VLAN {config.vlan}</span> : null}
          {config.dhcp ? <span className="dhcp-on">DHCP</span> : null}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="device-port device-port-out"
      />
    </div>
  )
}
