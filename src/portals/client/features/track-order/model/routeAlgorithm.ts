export type Coord = [number, number]
export type NodeType = 'restaurant' | 'waypoint' | 'destination'
export type AlgorithmType = 'dijkstra' | 'astar' | 'greedy' | 'bfs'

export interface RouteNode {
  id: string
  coord: Coord
  label: string
  type: NodeType
}

export interface PathResult {
  path: RouteNode[]
  exploredIds: string[]   // nodos visitados durante la búsqueda
  totalMeters: number
}

export interface RouteData {
  graph: RouteGraph
  restaurantName: string
}

export const ALGORITHM_INFO: Record<AlgorithmType, { label: string; color: string; description: string }> = {
  dijkstra: { label: 'Dijkstra',  color: '#FF6B00', description: 'Óptimo · distancia real'           },
  astar:    { label: 'A*',        color: '#8B5CF6', description: 'Óptimo · distancia + heurística'    },
  greedy:   { label: 'Greedy',    color: '#F59E0B', description: 'Rápido · solo heurística (no óptimo)' },
  bfs:      { label: 'BFS',       color: '#10B981', description: 'Mínimo saltos · ignora distancias'  },
}

// ── Min-Heap (árbol binario mínimo) para cola de prioridad ───────────────────
interface HeapItem { priority: number; id: string }

class MinHeap {
  private h: HeapItem[] = []
  get size() { return this.h.length }

  push(item: HeapItem) {
    this.h.push(item)
    this._up(this.h.length - 1)
  }

  pop(): HeapItem | undefined {
    if (!this.h.length) return undefined
    const top = this.h[0]
    const last = this.h.pop()!
    if (this.h.length) { this.h[0] = last; this._down(0) }
    return top
  }

  private _up(i: number) {
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.h[p].priority <= this.h[i].priority) break
      ;[this.h[p], this.h[i]] = [this.h[i], this.h[p]]
      i = p
    }
  }

  private _down(i: number) {
    const n = this.h.length
    while (true) {
      let m = i, l = 2*i+1, r = 2*i+2
      if (l < n && this.h[l].priority < this.h[m].priority) m = l
      if (r < n && this.h[r].priority < this.h[m].priority) m = r
      if (m === i) break
      ;[this.h[m], this.h[i]] = [this.h[i], this.h[m]]
      i = m
    }
  }
}

// ── Haversine (metros entre dos coordenadas) ─────────────────────────────────
function haversine([lat1, lng1]: Coord, [lat2, lng2]: Coord): number {
  const R = 6_371_000, r = Math.PI / 180
  const dLat = (lat2 - lat1) * r, dLng = (lng2 - lng1) * r
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*r)*Math.cos(lat2*r)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// ── Grafo de adyacencia ──────────────────────────────────────────────────────
export class RouteGraph {
  nodes = new Map<string, RouteNode>()
  private adj = new Map<string, Array<{ to: string; weight: number }>>()

  addNode(node: RouteNode) {
    this.nodes.set(node.id, node)
    this.adj.set(node.id, [])
  }

  addEdge(fromId: string, toId: string) {
    if (this.adj.get(fromId)?.some(e => e.to === toId)) return // sin duplicados
    const w = haversine(this.nodes.get(fromId)!.coord, this.nodes.get(toId)!.coord)
    this.adj.get(fromId)!.push({ to: toId, weight: w })
    this.adj.get(toId)!.push({ to: fromId, weight: w })
  }

  neighbors(id: string) { return this.adj.get(id) ?? [] }

  getEdges(): Array<[Coord, Coord]> {
    const seen = new Set<string>()
    const edges: Array<[Coord, Coord]> = []
    for (const [from, nb] of this.adj) {
      for (const { to } of nb) {
        const key = [from, to].sort().join('|')
        if (!seen.has(key)) {
          seen.add(key)
          edges.push([this.nodes.get(from)!.coord, this.nodes.get(to)!.coord])
        }
      }
    }
    return edges
  }

  private _rebuildPath(prev: Map<string, string | null>, endId: string): RouteNode[] {
    const path: RouteNode[] = []
    let cur: string | null = endId
    while (cur) {
      const n = this.nodes.get(cur)
      if (n) path.unshift(n)
      cur = prev.get(cur) ?? null
    }
    return path
  }

  private _meters(path: RouteNode[]): number {
    return path.reduce((s, n, i) => i === 0 ? 0 : s + haversine(path[i-1].coord, n.coord), 0)
  }

  // ── Dijkstra ── prioridad = distancia acumulada ──────────────────────────
  dijkstra(startId: string, endId: string): PathResult {
    const dist = new Map<string, number>()
    const prev = new Map<string, string | null>()
    const visited = new Set<string>()
    for (const id of this.nodes.keys()) { dist.set(id, Infinity); prev.set(id, null) }
    dist.set(startId, 0)
    const pq = new MinHeap()
    pq.push({ priority: 0, id: startId })

    while (pq.size > 0) {
      const { id } = pq.pop()!
      if (visited.has(id)) continue
      visited.add(id)
      if (id === endId) break
      for (const { to, weight } of this.neighbors(id)) {
        const alt = dist.get(id)! + weight
        if (alt < dist.get(to)!) { dist.set(to, alt); prev.set(to, id); pq.push({ priority: alt, id: to }) }
      }
    }
    const path = this._rebuildPath(prev, endId)
    return { path, exploredIds: [...visited], totalMeters: this._meters(path) }
  }

  // ── A* ── prioridad = g(n) + h(n), h = haversine al destino ─────────────
  astar(startId: string, endId: string): PathResult {
    const endCoord = this.nodes.get(endId)!.coord
    const h = (id: string) => haversine(this.nodes.get(id)!.coord, endCoord)

    const g = new Map<string, number>()
    const prev = new Map<string, string | null>()
    const visited = new Set<string>()
    for (const id of this.nodes.keys()) { g.set(id, Infinity); prev.set(id, null) }
    g.set(startId, 0)
    const pq = new MinHeap()
    pq.push({ priority: h(startId), id: startId })

    while (pq.size > 0) {
      const { id } = pq.pop()!
      if (visited.has(id)) continue
      visited.add(id)
      if (id === endId) break
      for (const { to, weight } of this.neighbors(id)) {
        const ng = g.get(id)! + weight
        if (ng < g.get(to)!) { g.set(to, ng); prev.set(to, id); pq.push({ priority: ng + h(to), id: to }) }
      }
    }
    const path = this._rebuildPath(prev, endId)
    return { path, exploredIds: [...visited], totalMeters: this._meters(path) }
  }

  // ── Greedy Best-First ── prioridad = solo h(n), sin considerar costo ─────
  greedy(startId: string, endId: string): PathResult {
    const endCoord = this.nodes.get(endId)!.coord
    const h = (id: string) => haversine(this.nodes.get(id)!.coord, endCoord)

    const prev = new Map<string, string | null>()
    const visited = new Set<string>()
    for (const id of this.nodes.keys()) prev.set(id, null)
    const pq = new MinHeap()
    pq.push({ priority: h(startId), id: startId })

    while (pq.size > 0) {
      const { id } = pq.pop()!
      if (visited.has(id)) continue
      visited.add(id)
      if (id === endId) break
      for (const { to } of this.neighbors(id)) {
        if (!visited.has(to)) { prev.set(to, id); pq.push({ priority: h(to), id: to }) }
      }
    }
    const path = this._rebuildPath(prev, endId)
    return { path, exploredIds: [...visited], totalMeters: this._meters(path) }
  }

  // ── BFS ── cola FIFO, ignora pesos (mínimo número de saltos) ─────────────
  bfs(startId: string, endId: string): PathResult {
    const prev = new Map<string, string | null>()
    const visited = new Set<string>()
    for (const id of this.nodes.keys()) prev.set(id, null)
    const queue: string[] = [startId]
    visited.add(startId)

    while (queue.length > 0) {
      const id = queue.shift()!
      if (id === endId) break
      for (const { to } of this.neighbors(id)) {
        if (!visited.has(to)) { visited.add(to); prev.set(to, id); queue.push(to) }
      }
    }
    const path = this._rebuildPath(prev, endId)
    return { path, exploredIds: [...visited], totalMeters: this._meters(path) }
  }

  runAlgorithm(algo: AlgorithmType): PathResult {
    switch (algo) {
      case 'dijkstra': return this.dijkstra('restaurant', 'destination')
      case 'astar':    return this.astar('restaurant', 'destination')
      case 'greedy':   return this.greedy('restaurant', 'destination')
      case 'bfs':      return this.bfs('restaurant', 'destination')
    }
  }
}

// ── Generador de grafo disperso (K vecinos más cercanos) ─────────────────────
const CENTER: Coord = [-17.3895, -66.1568]
const SPREAD = 0.02

const RESTAURANT_NAMES = [
  'La Trattoria','Burger Mania','Sushi Zen','El Fogón','Pizza Roma',
  'Wok Palace','La Parrilla','Taco Fiesta','Mar y Tierra','Baguette Café',
]
const STREET_LABELS = [
  'Av. Heroínas','Av. Ballivián','Calle Calama','Av. Aroma',
  'Calle España','Av. América','Calle Jordán','Av. San Martín',
  'Calle Baptista','Av. Blanco Galindo','Calle 25 de Mayo','Av. Oquendo',
]

function rand() { return (Math.random() - 0.5) * 2 * SPREAD }

export function generateRandomGraph(waypointCount = 7): RouteData {
  const graph = new RouteGraph()
  const restaurantName = RESTAURANT_NAMES[Math.floor(Math.random() * RESTAURANT_NAMES.length)]

  graph.addNode({ id: 'restaurant', coord: [CENTER[0]+rand(), CENTER[1]+rand()], label: restaurantName,  type: 'restaurant' })
  graph.addNode({ id: 'destination', coord: [CENTER[0]+rand(), CENTER[1]+rand()], label: 'Tu casa', type: 'destination' })

  for (let i = 0; i < waypointCount; i++) {
    graph.addNode({
      id: `wp-${i}`,
      coord: [CENTER[0]+rand(), CENTER[1]+rand()] as Coord,
      label: STREET_LABELS[Math.floor(Math.random() * STREET_LABELS.length)],
      type: 'waypoint',
    })
  }

  // Grafo disperso: cada nodo conecta con sus K vecinos más cercanos
  const K = 3
  const allNodes = Array.from(graph.nodes.values())
  for (const node of allNodes) {
    allNodes
      .filter(n => n.id !== node.id)
      .sort((a, b) => haversine(node.coord, a.coord) - haversine(node.coord, b.coord))
      .slice(0, K)
      .forEach(n => graph.addEdge(node.id, n.id))
  }

  // Garantizar conectividad: BFS desde restaurante
  const reachable = new Set<string>()
  const q = ['restaurant']
  while (q.length) {
    const id = q.shift()!
    reachable.add(id)
    graph.neighbors(id).forEach(({ to }) => { if (!reachable.has(to)) q.push(to) })
  }

  // Si destino no es alcanzable, conectar con el nodo alcanzable más cercano
  if (!reachable.has('destination')) {
    const dest = graph.nodes.get('destination')!
    let best = { id: '', dist: Infinity }
    for (const id of reachable) {
      const d = haversine(graph.nodes.get(id)!.coord, dest.coord)
      if (d < best.dist) best = { id, dist: d }
    }
    graph.addEdge(best.id, 'destination')
  }

  return { graph, restaurantName }
}
