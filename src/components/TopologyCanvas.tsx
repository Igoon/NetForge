import { useCallback, useEffect, useMemo, type DragEvent } from 'react'
import {
  Background,
  BackgroundVariant,
  ConnectionMode,
  Controls,
  ReactFlow,
  useReactFlow,
  type EdgeTypes,
  type NodeTypes,
} from '@xyflow/react'
import { DEVICES } from '../data/devices'
import { useGameStore } from '../store/gameStore'
import type { DeviceType } from '../types'
import { CustomerOrderModal } from './CustomerOrderModal'
import { DeviceNodeCard } from './DeviceNode'
import { ComicPopup } from './ComicPopup'
import { LoadoutOverlay } from './LoadoutOverlay'
import { PacketEdgeView } from './PacketEdge'

const nodeTypes = { device: DeviceNodeCard } as unknown as NodeTypes
const edgeTypes = { packet: PacketEdgeView } as unknown as EdgeTypes

export function TopologyCanvas() {
  const nodes = useGameStore((state) => state.nodes)
  const edges = useGameStore((state) => state.edges)
  const activeEdgeIds = useGameStore((state) => state.activeEdgeIds)
  const simulating = useGameStore((state) => state.simulating)
  const incidents = useGameStore((state) => state.incidents)
  const onNodesChange = useGameStore((state) => state.onNodesChange)
  const onEdgesChange = useGameStore((state) => state.onEdgesChange)
  const onConnect = useGameStore((state) => state.onConnect)
  const addDevice = useGameStore((state) => state.addDevice)
  const setSelectedNode = useGameStore((state) => state.setSelectedNode)
  const levelId = useGameStore((state) => state.levelId)
  const { screenToFlowPosition, fitView } = useReactFlow()
  const activeFx = incidents.find(
    (incident) => incident.status === 'active',
  )?.type

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 700px)').matches
    const timer = setTimeout(() => {
      fitView({ padding: narrow ? 0.06 : 0.2, duration: 260 })
    }, 80)
    return () => clearTimeout(timer)
  }, [fitView, levelId])

  const displayEdges = useMemo(() => {
    const active = new Set(activeEdgeIds)
    return edges.map((edge) => ({
      ...edge,
      data: { ...edge.data, active: active.has(edge.id) },
    }))
  }, [activeEdgeIds, edges])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const deviceType = event.dataTransfer.getData(
        'application/netforge-device',
      ) as DeviceType
      if (!DEVICES[deviceType]) return
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      addDevice(deviceType, {
        x: position.x - 85,
        y: position.y - 40,
      })
    },
    [addDevice, screenToFlowPosition],
  )

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }, [])

  return (
    <div
      className={`canvas-shell${activeFx ? ` fx-${activeFx}` : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={({ nodes: selected }) =>
          setSelectedNode(selected[0]?.id ?? null)
        }
        defaultEdgeOptions={{
          type: 'packet',
        }}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={1.7}
        deleteKeyCode={['Backspace', 'Delete']}
        connectionLineStyle={{ stroke: '#0f766e', strokeWidth: 2.2 }}
        proOptions={{ hideAttribution: true }}
        colorMode="light"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1.3}
          color="#d8d2c5"
        />
        <Controls position="bottom-right" showInteractive={false} />
      </ReactFlow>

      <div className="canvas-badge">
        <span className="live-dot" />
        {simulating ? 'Mengirim paket...' : 'Canvas aktif'}
      </div>

      <div className="canvas-tip">
        Tarik dari port kanan ke port kiri · Klik perangkat untuk konfigurasi
      </div>

      <CustomerOrderModal />
      <LoadoutOverlay />
      <ComicPopup />
    </div>
  )
}

