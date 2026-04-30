import { useState, useMemo, useEffect, Component } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Phone, MessageCircle, CheckCircle2, Circle,
  Shuffle, Navigation, Play, Pause, RotateCcw,
} from 'lucide-react'
import {
  generateRandomGraph, ALGORITHM_INFO,
} from '@client/features/track-order/model/routeAlgorithm'
import type { AlgorithmType, RouteData } from '@client/features/track-order/model/routeAlgorithm'
import TrackingMap from '@client/features/track-order/ui/TrackingMap'

/* ── ErrorBoundary para el mapa ─────────────────────────────── */
class MapErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) return (
      <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center gap-1">
        <p className="text-[#606060] text-xs">No se pudo cargar el mapa</p>
        <p className="text-[#3A3A3A] text-[10px] font-mono">{this.state.error}</p>
      </div>
    )
    return this.props.children
  }
}

/* ── Timeline ───────────────────────────────────────────────── */
const TIMELINE = [
  { id: 1, label: 'Pedido recibido',      time: '13:02', done: true,  active: false },
  { id: 2, label: 'Restaurante confirmó', time: '13:04', done: true,  active: false },
  { id: 3, label: 'Preparando tu pedido', time: '13:05', done: true,  active: true  },
  { id: 4, label: 'En camino',            time: '--:--', done: false, active: false },
  { id: 5, label: 'Entregado',            time: '--:--', done: false, active: false },
]

const ALGOS: AlgorithmType[] = ['dijkstra', 'astar', 'greedy', 'bfs']

const TILES = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
} as const
type TileKey = keyof typeof TILES

const SPEEDS = [
  { label: 'Rápido', ms: 80  },
  { label: 'Normal', ms: 200 },
  { label: 'Lento',  ms: 500 },
]

function fmt(m: number) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`
}

export default function OrderTrackingPage() {
  const [graphData, setGraphData]     = useState<RouteData>(() => generateRandomGraph(7))
  const [algorithm, setAlgorithm]     = useState<AlgorithmType>('dijkstra')
  const [isAnimating, setIsAnimating] = useState(false)

  // Mapa
  const [mapTile, setMapTile]         = useState<TileKey>('dark')

  // Animación paso a paso
  const [animStep, setAnimStep]       = useState(0)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [animSpeed, setAnimSpeed]     = useState(200)

  const pathResult = useMemo(() => graphData.graph.runAlgorithm(algorithm), [graphData, algorithm])
  const allNodes   = useMemo(() => Array.from(graphData.graph.nodes.values()), [graphData])
  const graphEdges = useMemo(() => graphData.graph.getEdges(), [graphData])

  const info       = ALGORITHM_INFO[algorithm]
  const totalSteps = pathResult.exploredIds.length
  const animComplete    = animStep >= totalSteps
  const hasAnimStarted  = animStep > 0 || isPlaying

  // Reset animación al cambiar grafo o algoritmo
  useEffect(() => {
    setAnimStep(0)
    setIsPlaying(false)
  }, [graphData, algorithm])

  // Ticker de animación
  useEffect(() => {
    if (!isPlaying) return
    if (animComplete) { setIsPlaying(false); return }
    const id = setTimeout(() => setAnimStep(s => s + 1), animSpeed)
    return () => clearTimeout(id)
  }, [isPlaying, animStep, animComplete, animSpeed])

const visibleExploredIds = hasAnimStarted
    ? pathResult.exploredIds.slice(0, animStep)
    : pathResult.exploredIds

  const visiblePath = hasAnimStarted && !animComplete ? [] : pathResult.path

  function handleRandomize() {
    setIsAnimating(true)
    setTimeout(() => {
      setGraphData(generateRandomGraph(Math.floor(Math.random() * 4) + 6))
      setIsAnimating(false)
    }, 300)
  }

  function handlePlayPause() {
    if (animComplete) { setAnimStep(0); setIsPlaying(true) }
    else setIsPlaying(p => !p)
  }

  function handleReset() {
    setIsPlaying(false)
    setAnimStep(0)
  }

  const tile = TILES[mapTile]

  return (
    <div className="min-h-screen bg-[#0F0F0F] max-w-md mx-auto lg:max-w-2xl flex flex-col">

      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-4 border-b border-[#1F1F1F]">
        <Link to="/cart" className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
          <ArrowLeft className="w-4 h-4 text-white" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white">Pedido #FD-0042</h1>
          <p className="text-xs font-medium" style={{ color: info.color }}>Preparando tu pedido…</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-[#606060]">Tiempo estimado</p>
          <p className="text-base font-bold text-white">~22 min</p>
        </div>
      </header>

      {/* Selector de algoritmo */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4" style={{ color: info.color }} />
            <span className="text-sm font-bold text-white">Algoritmo de ruta</span>
          </div>
          <button
            onClick={handleRandomize}
            disabled={isAnimating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#A0A0A0] text-xs font-semibold hover:text-white transition-all disabled:opacity-40"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isAnimating ? 'animate-spin' : ''}`} />
            Randomizar grafo
          </button>
        </div>

        {/* Botones de algoritmo */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {ALGOS.map(algo => {
            const a = ALGORITHM_INFO[algo]
            const active = algorithm === algo
            return (
              <button
                key={algo}
                onClick={() => setAlgorithm(algo)}
                className="py-2 rounded-lg text-xs font-bold transition-all border"
                style={{
                  background:   active ? a.color + '22' : 'transparent',
                  borderColor:  active ? a.color : '#2A2A2A',
                  color:        active ? a.color : '#606060',
                }}
              >
                {a.label}
              </button>
            )
          })}
        </div>

        {/* Descripción del algoritmo activo */}
        <p className="text-[11px] mb-3 px-0.5" style={{ color: info.color + 'BB' }}>
          {info.description}
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-4 gap-1.5 text-center">
          {[
            { label: 'Distancia',  value: fmt(pathResult.totalMeters) },
            { label: 'Paradas',    value: `${Math.max(0, pathResult.path.length - 2)}` },
            { label: 'Explorados', value: `${totalSteps}` },
            { label: 'Nodos',      value: `${allNodes.length}` },
          ].map(m => (
            <div key={m.label} className="bg-[#111] rounded-lg py-2">
              <p className="text-[9px] text-[#606060] uppercase tracking-wide">{m.label}</p>
              <p className="text-sm font-bold text-white">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Ruta encontrada con coordenadas */}
        <div className="mt-2.5 space-y-1 max-h-20 overflow-y-auto pr-1">
          {pathResult.path.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2 text-xs">
              <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[8px] font-bold text-white"
                style={{ background: node.type === 'destination' ? '#10B981' : info.color }}>
                {i + 1}
              </span>
              <span className="text-[#A0A0A0] truncate">{node.label}</span>
              <span className="ml-auto text-[#505060] font-mono shrink-0 text-[9px]">
                ({node.coord[0].toFixed(4)}, {node.coord[1].toFixed(4)})
              </span>
            </div>
          ))}
        </div>

        {/* ── Controles de animación ── */}
        <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handlePlayPause}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all"
              style={{
                background:  info.color + '22',
                borderColor: info.color + '66',
                color:       info.color,
              }}
            >
              {isPlaying
                ? <Pause className="w-3.5 h-3.5" />
                : <Play  className="w-3.5 h-3.5" />
              }
              {isPlaying ? 'Pausar' : animComplete ? 'Reiniciar' : animStep > 0 ? 'Continuar' : 'Animar'}
            </button>

            <button
              onClick={handleReset}
              disabled={!hasAnimStarted}
              className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#606060] hover:text-white transition-all disabled:opacity-30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex gap-1 ml-auto">
              {SPEEDS.map(s => (
                <button
                  key={s.ms}
                  onClick={() => setAnimSpeed(s.ms)}
                  className="px-2 py-1 rounded text-[10px] font-semibold border transition-all"
                  style={{
                    background:  animSpeed === s.ms ? '#FFFFFF11' : 'transparent',
                    borderColor: animSpeed === s.ms ? '#FFFFFF33' : '#2A2A2A',
                    color:       animSpeed === s.ms ? '#D0D0D0'   : '#505060',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width:   `${totalSteps > 0 ? (animStep / totalSteps) * 100 : 100}%`,
                  background: info.color,
                  opacity: hasAnimStarted ? 1 : 0.3,
                }}
              />
            </div>
            <span className="text-[10px] text-[#606060] font-mono shrink-0">
              {hasAnimStarted ? `${animStep}/${totalSteps}` : `${totalSteps}/${totalSteps}`}
            </span>
          </div>
        </div>
      </div>

      {/* ── Mapa con controles overlay ── */}
      <div
        className={`relative overflow-hidden border border-[#2A2A2A] mx-4 mt-3 rounded-2xl transition-opacity duration-300 ${isAnimating ? 'opacity-20' : 'opacity-100'}`}
        style={{ height: '300px' }}
      >
        {/* Overlay: selector de tile */}
        <div className="absolute top-2 right-2 z-[1001] flex items-center pointer-events-none">
          <div className="flex gap-1 pointer-events-auto">
            {(Object.keys(TILES) as TileKey[]).map(key => (
              <button
                key={key}
                onClick={() => setMapTile(key)}
                className="px-2 py-1 rounded-md text-[10px] font-bold border backdrop-blur-sm transition-all"
                style={{
                  background:  mapTile === key ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.55)',
                  borderColor: mapTile === key ? 'rgba(255,255,255,0.4)'  : 'rgba(255,255,255,0.1)',
                  color:       mapTile === key ? '#fff' : '#999',
                }}
              >
                {key === 'dark' ? 'Dark' : 'OSM'}
              </button>
            ))}
          </div>
        </div>

        <MapErrorBoundary>
          <TrackingMap
            path={visiblePath}
            allNodes={allNodes}
            graphEdges={graphEdges}
            exploredIds={visibleExploredIds}
            algoColor={info.color}
            tileUrl={tile.url}
            tileAttribution={tile.attribution}
          />
        </MapErrorBoundary>
      </div>

      {/* Leyenda */}
      <div className="mx-4 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[#606060]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full inline-block" style={{ background: info.color }} />
          En ruta ({info.label})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#64748B] inline-block" />
          Explorado
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-[#2A2A3A] border border-[#3A3A4A] inline-block" />
          No visitado
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <span className="w-4 h-0.5 inline-block" style={{ background: info.color }} />
          Ruta óptima
        </span>
      </div>

      {/* Repartidor */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
          JM
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">Juan Martínez</p>
          <div className="flex items-center gap-1 text-xs text-[#606060]">
            <span className="text-yellow-400">★</span> 4.9 · Repartidor verificado
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-full bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center">
            <Phone className="w-4 h-4 text-[#FF6B00]" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-[#A0A0A0]" />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="mx-4 mt-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4">
        <h3 className="text-sm font-bold text-[#A0A0A0] uppercase tracking-wider mb-4">Estado del pedido</h3>
        <div className="space-y-0">
          {TIMELINE.map((step, i) => (
            <div key={step.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                {step.done || step.active
                  ? <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${step.active ? 'text-[#FF6B00]' : 'text-emerald-400'}`} />
                  : <Circle className="w-5 h-5 flex-shrink-0 text-[#3A3A3A]" />
                }
                {i < TIMELINE.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${step.done ? 'bg-emerald-400/40' : 'bg-[#2A2A2A]'}`} />
                )}
              </div>
              <div className="pb-6 last:pb-0">
                <p className={`text-sm font-semibold ${step.active ? 'text-[#FF6B00]' : step.done ? 'text-white' : 'text-[#3A3A3A]'}`}>
                  {step.label}{step.active && <span className="ml-2 text-xs animate-pulse">●</span>}
                </p>
                <p className="text-xs text-[#606060] mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="mx-4 mt-4 mb-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3">
        <p className="text-sm text-[#A0A0A0]">
          {graphData.restaurantName} · 3 artículos · <span className="text-[#FF6B00] font-semibold">Bs. 485</span>
        </p>
      </div>
    </div>
  )
}
