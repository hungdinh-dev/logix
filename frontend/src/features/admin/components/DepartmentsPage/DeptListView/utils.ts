import type { DepartmentTreeResponse } from '../../../types/admin.types'

export type FlatRow = { node: DepartmentTreeResponse; depth: number; parentId: string | null }

export const ROOT_ID = '__root__'

export function flatten(
  nodes: DepartmentTreeResponse[],
  depth = 0,
  parentId: string | null = null,
  out: FlatRow[] = [],
): FlatRow[] {
  for (const n of nodes) {
    out.push({ node: n, depth, parentId })
    flatten(n.children, depth + 1, n.id, out)
  }
  return out
}

export function findNode(nodes: DepartmentTreeResponse[], id: string): DepartmentTreeResponse | null {
  for (const n of nodes) {
    if (n.id === id) return n
    const found = findNode(n.children, id)
    if (found) return found
  }
  return null
}

export function descendantIds(node: DepartmentTreeResponse): Set<string> {
  const ids = new Set<string>()
  const visit = (n: DepartmentTreeResponse) => { ids.add(n.id); n.children.forEach(visit) }
  node.children.forEach(visit)
  return ids
}

export function removeNode(
  nodes: DepartmentTreeResponse[],
  id: string,
): { tree: DepartmentTreeResponse[]; removed: DepartmentTreeResponse | null } {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      return { tree: [...nodes.slice(0, i), ...nodes.slice(i + 1)], removed: nodes[i] }
    }
    const result = removeNode(nodes[i].children, id)
    if (result.removed) {
      return {
        tree: [...nodes.slice(0, i), { ...nodes[i], children: result.tree }, ...nodes.slice(i + 1)],
        removed: result.removed,
      }
    }
  }
  return { tree: nodes, removed: null }
}

export function insertNode(
  nodes: DepartmentTreeResponse[],
  parentId: string | null,
  node: DepartmentTreeResponse,
): DepartmentTreeResponse[] {
  if (!parentId) return [...nodes, node]
  return nodes.map(n =>
    n.id === parentId
      ? { ...n, children: [...n.children, node] }
      : { ...n, children: insertNode(n.children, parentId, node) },
  )
}
