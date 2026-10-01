import React, { useState, useRef, useCallback, useEffect } from 'react';

export default function ResizableSplitPane({
  direction = 'horizontal', // 'horizontal' (left/right) or 'vertical' (top/bottom)
  initialSplit = 45, // percentage
  minSize = 25, // percentage
  maxSize = 75, // percentage
  primary,
  secondary,
  className = ''
}) {
  const [split, setSplit] = useState(initialSplit);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    isDragging.current = true;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [direction]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let percentage = 50;

    if (direction === 'horizontal') {
      const offset = e.clientX - rect.left;
      percentage = (offset / rect.width) * 100;
    } else {
      const offset = e.clientY - rect.top;
      percentage = (offset / rect.height) * 100;
    }

    if (percentage >= minSize && percentage <= maxSize) {
      setSplit(percentage);
    }
  }, [direction, minSize, maxSize]);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} w-full h-full overflow-hidden ${className}`}
    >
      {/* Primary Pane */}
      <div
        style={{
          [direction === 'horizontal' ? 'width' : 'height']: `${split}%`
        }}
        className="overflow-hidden flex flex-col min-w-0 min-h-0"
      >
        {primary}
      </div>

      {/* Drag Divider */}
      <div
        onMouseDown={handleMouseDown}
        className={`${
          direction === 'horizontal'
            ? 'w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-500'
            : 'h-1.5 cursor-row-resize hover:bg-indigo-500/50 active:bg-indigo-500'
        } bg-[#1c202e] transition-colors flex-shrink-0 relative group z-10`}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`${direction === 'horizontal' ? 'w-0.5 h-6' : 'h-0.5 w-6'} bg-[#454b66] rounded-full group-hover:bg-indigo-400`} />
        </div>
      </div>

      {/* Secondary Pane */}
      <div
        style={{
          [direction === 'horizontal' ? 'width' : 'height']: `${100 - split}%`
        }}
        className="overflow-hidden flex flex-col min-w-0 min-h-0 flex-1"
      >
        {secondary}
      </div>
    </div>
  );
}
