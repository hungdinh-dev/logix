export const restrictToVerticalAxis = ({ transform }: any) => ({
  ...transform,
  x: 0,
})

export const restrictToWindowEdges = ({ transform }: any) => transform
