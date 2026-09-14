'use client'

import React from 'react'

export interface RenderNodeProps<T = any> {
  node: T
  isExpanded?: boolean
  isSelected?: boolean
  onToggle?: (id: string) => void
  onSelect?: (node: T) => void
  [key: string]: any
}

export interface OrgChartTreeProps<T = any> {
  tree?: T
  data?: T | T[]
  renderNode?: (props: RenderNodeProps<T>) => React.ReactNode
  selectedId?: string | null
  expandedIds?: Set<string>
  onSelect?: (node: T) => void
  onToggle?: (id: string) => void
  scale?: number
  onZoomChange?: (scale: number) => void
  editMode?: boolean
  focusId?: string | null
  [key: string]: any
}

export function OrgChartTree<T extends { id: string; children?: T[] }>({
  tree,
  data,
  renderNode,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: OrgChartTreeProps<T>) {
  const rootNodes: T[] = tree ? [tree] : Array.isArray(data) ? data : data ? [data] : []

  const renderSingleNode = (node: T) => {
    const isExpanded = expandedIds ? expandedIds.has(node.id) : true
    const isSelected = selectedId === node.id

    return (
      <div key={node.id} className="p-3 border rounded-lg bg-card shadow-sm mb-2">
        {renderNode ? (
          renderNode({ node, isExpanded, isSelected, onToggle, onSelect })
        ) : (
          <div className="font-semibold">{(node as any).title || (node as any).displayName || (node as any).roleName || (node as any).departmentName}</div>
        )}
        {isExpanded && node.children && node.children.length > 0 && (
          <div className="pl-4 mt-2 border-l space-y-2">
            {node.children.map((child) => renderSingleNode(child))}
          </div>
        )}
      </div>
    )
  }

  return <div className="space-y-2">{rootNodes.map((node) => renderSingleNode(node))}</div>
}
