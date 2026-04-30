import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { RouteNode, Coord } from '../model/routeAlgorithm'

function makeIcon(emoji: string, bg: string, size = 34, border = 'white') {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${bg};border:2px solid ${border};
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size*0.47)}px;
      box-shadow:0 2px 8px rgba(0,0,0,0.55);
    ">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2 - 2],
  })
}

function FitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap()
  const prev = useRef('')
  useEffect(() => {
    const key = coords.map(c => c.join(',')).join('|')
    if (coords.length > 1 && key !== prev.current) {
      prev.current = key
      const b = coords.reduce(
        (b, c) => b.extend(c as L.LatLngTuple),
        L.latLngBounds(coords[0] as L.LatLngTuple, coords[0] as L.LatLngTuple)
      )
      map.fitBounds(b, { padding: [44, 44] })
    }
  }, [coords, map])
  return null
}

interface Props {
  path: RouteNode[]
  allNodes: RouteNode[]
  graphEdges: Array<[Coord, Coord]>
  exploredIds: string[]
  algoColor: string
  tileUrl: string
  tileAttribution: string
}

export default function TrackingMap({ path, allNodes, graphEdges, exploredIds, algoColor, tileUrl, tileAttribution }: Props) {
  const allCoords = allNodes.map(n => n.coord as [number, number])
  const center: [number, number] = allCoords[0] ?? [-17.3895, -66.1568]

  const inPath = new Set(path.map(n => n.id))
  const explored = new Set(exploredIds)

  const pathCoords = path.map(n => n.coord as [number, number])
  const pathEdges = new Set(
    path.slice(0, -1).map((n, i) => [n.coord, path[i+1].coord].map(c => c.join(',')).sort().join('||'))
  )

  function iconFor(node: RouteNode): L.DivIcon {
    if (inPath.has(node.id)) {
      if (node.type === 'restaurant')  return makeIcon('🍕', algoColor)
      if (node.type === 'destination') return makeIcon('🏠', '#10B981')
      return makeIcon('📍', algoColor, 30)
    }
    if (explored.has(node.id)) return makeIcon('○', '#64748B', 26, '#94A3B8')
    return makeIcon('·', '#2A2A3A', 22, '#3A3A4A')
  }

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom
      key={center.join(',')}
    >
      <TileLayer url={tileUrl} attribution={tileAttribution} />

      {/* Aristas del grafo (gris punteado) */}
      {graphEdges.map(([a, b], i) => {
        const edgeKey = [a, b].map(c => c.join(',')).sort().join('||')
        if (pathEdges.has(edgeKey)) return null
        return (
          <Polyline
            key={i}
            positions={[a as L.LatLngTuple, b as L.LatLngTuple]}
            pathOptions={{ color: '#3A3A5A', weight: 1.5, opacity: 0.5, dashArray: '3 6' }}
          />
        )
      })}

      {/* Ruta óptima */}
      {pathCoords.length > 1 && (
        <Polyline
          positions={pathCoords}
          pathOptions={{ color: algoColor, weight: 4.5, opacity: 0.95 }}
        />
      )}

      {/* Nodos */}
      {allNodes.map(node => (
        <Marker key={node.id} position={node.coord as L.LatLngTuple} icon={iconFor(node)}>
          <Popup>
            <strong style={{ fontSize: '13px' }}>{node.label}</strong><br />
            <span style={{ fontSize: '11px', color: '#888' }}>
              {inPath.has(node.id) ? '✅ En ruta' : explored.has(node.id) ? '🔍 Explorado' : '⬜ No visitado'}
            </span><br />
            <span style={{ fontSize: '10px', color: '#aaa', fontFamily: 'monospace' }}>
              {node.coord[0].toFixed(5)}, {node.coord[1].toFixed(5)}
            </span>
          </Popup>
        </Marker>
      ))}

      <FitBounds coords={allCoords} />
    </MapContainer>
  )
}
