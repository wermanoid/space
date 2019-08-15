import React from 'react';

const Viewer = React.forwardRef<HTMLCanvasElement, { className?: string }>(
  ({ className }, ref) => (
    <canvas className={className} height={1000} width={1000} ref={ref} />
  )
);

export default Viewer;
