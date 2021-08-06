import * as React from 'react'
import { useShapeTree } from '../hooks/useShapeTree'
import { IShapeTreeNode, TLPage, TLPageState, TLShape } from '../../types'
import { Shape as ShapeComponent } from './shape'
import { useHandles, useRenderOnResize, useTLContext } from '../hooks'
import { Bounds } from './bounds'
import { BoundsBg } from './bounds/bounds-bg'
import { useSelection } from '../hooks'
import { Handles } from './handles'

interface PageProps<T extends TLShape> {
  page: TLPage<T>
  pageState: TLPageState
  hideBounds: boolean
}

export function Page<T extends TLShape>({
  page,
  pageState,
  hideBounds,
}: PageProps<T>): JSX.Element {
  const { callbacks, shapeUtils } = useTLContext()

  useRenderOnResize()

  const shapeTree = useShapeTree(page, pageState, shapeUtils, pageState, callbacks.onChange)

  const { shapeWithHandles } = useHandles(page, pageState)

  const { bounds, isLocked, rotation } = useSelection(page, pageState, shapeUtils)

  return (
    <>
      {bounds && !hideBounds && <BoundsBg bounds={bounds} rotation={rotation} />}
      {shapeTree.map(node => (
        <ShapeNode key={node.shape.id} allowHovers={true} {...node} />
      ))}
      {bounds && !hideBounds && (
        <Bounds
          zoom={pageState.camera.zoom}
          bounds={bounds}
          isLocked={isLocked}
          rotation={rotation}
        />
      )}
      {shapeWithHandles && <Handles shape={shapeWithHandles} />}
    </>
  )
}

interface ShapeNodeProps extends IShapeTreeNode {
  allowHovers: boolean
}

const ShapeNode = React.memo(
  ({
    shape,
    children,
    isEditing,
    isHovered,
    isDarkMode,
    isSelected,
    isBinding,
    isCurrentParent,
    allowHovers,
  }: ShapeNodeProps) => {
    return (
      <>
        <ShapeComponent
          shape={shape}
          isEditing={isEditing}
          isHovered={allowHovers && isHovered}
          isSelected={isSelected}
          isDarkMode={isDarkMode}
          isBinding={isBinding}
          isCurrentParent={isCurrentParent}
        />
        {children &&
          children.map(childNode => (
            <ShapeNode key={childNode.shape.id} allowHovers={allowHovers} {...childNode} />
          ))}
      </>
    )
  }
)