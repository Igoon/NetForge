import { DEVICES } from '../data/devices'
import { useGameStore } from '../store/gameStore'
import { DeviceGlyph } from './DeviceGlyph'

export function Inspector() {
  const node = useGameStore((state) =>
    state.nodes.find((item) => item.id === state.selectedNodeId),
  )
  const updateConfig = useGameStore((state) => state.updateConfig)
  const renameNode = useGameStore((state) => state.renameNode)

  if (!node) {
    return (
      <section className="panel inspector-panel">
        <div className="panel-heading">
          <span className="eyebrow">Inspektur</span>
          <h2>Konfigurasi</h2>
        </div>
        <p className="empty-note">
          Pilih perangkat di kanvas untuk melihat dan mengubah konfigurasinya.
        </p>
        <div className="inspector-tips">
          <div>
            <span>1</span> Seret perangkat dari palet
          </div>
          <div>
            <span>2</span> Hubungkan port kanan ke port kiri
          </div>
          <div>
            <span>3</span> Isi IP, subnet, VLAN, atau DHCP
          </div>
          <div>
            <span>4</span> Tekan Simulasikan untuk menguji misi
          </div>
        </div>
      </section>
    )
  }

  const spec = DEVICES[node.data.deviceType]
  const config = node.data.config

  return (
    <section className="panel inspector-panel">
      <div className="panel-heading inspector-heading">
        <span className="inspector-glyph" style={{ color: spec.color }}>
          <DeviceGlyph type={node.data.deviceType} />
        </span>
        <div className="inspector-title">
          <span className="eyebrow">Inspektur</span>
          <h2>{node.data.label}</h2>
        </div>
        <span
          className="inspector-type"
          style={{ color: spec.color, borderColor: `${spec.color}55` }}
        >
          {spec.label}
        </span>
      </div>
      <p className="panel-subtitle">{spec.description}</p>

      <label className="field">
        <span>Nama perangkat</span>
        <input
          value={node.data.label}
          onChange={(event) => renameNode(node.id, event.target.value)}
        />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Alamat IP</span>
          <input
            value={config.ip}
            placeholder="192.168.1.10"
            onChange={(event) => updateConfig(node.id, { ip: event.target.value })}
          />
        </label>
        <label className="field">
          <span>Subnet mask</span>
          <input
            value={config.subnet}
            placeholder="255.255.255.0"
            onChange={(event) =>
              updateConfig(node.id, { subnet: event.target.value })
            }
          />
        </label>
      </div>

      <div className="field-grid">
        <label className="field">
          <span>Gateway</span>
          <input
            value={config.gateway}
            placeholder="192.168.1.1"
            onChange={(event) =>
              updateConfig(node.id, { gateway: event.target.value })
            }
          />
        </label>
        <label className="field">
          <span>VLAN</span>
          <input
            value={config.vlan}
            placeholder="10"
            onChange={(event) =>
              updateConfig(node.id, { vlan: event.target.value })
            }
          />
        </label>
      </div>

      <label className="switch-row">
        <span>
          <strong>Aktifkan DHCP</strong>
          <small>Perangkat memberi atau menerima alamat otomatis.</small>
        </span>
        <input
          type="checkbox"
          checked={config.dhcp}
          onChange={(event) =>
            updateConfig(node.id, { dhcp: event.target.checked })
          }
        />
      </label>

      {node.data.fixed ? (
        <p className="fixed-note">
          Perangkat ini adalah bagian dari skenario dan tidak dapat dihapus.
        </p>
      ) : (
        <p className="fixed-note">Pilih lalu tekan Delete untuk menghapus.</p>
      )}
    </section>
  )
}
