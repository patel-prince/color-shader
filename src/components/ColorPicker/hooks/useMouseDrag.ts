import { useCallback, useRef } from "react";

interface MouseDragOptions {
  onDrag: (clientX: number, clientY: number) => void;
  onStart?: (clientX: number, clientY: number) => void;
  onEnd?: () => void;
}

/**
 * Custom hook for handling mouse drag interactions across color picker components
 * Provides unified mouse drag behavior with proper event cleanup and performance optimization
 * @param options - Configuration object for drag behavior callbacks
 * @param options.onDrag - Called during drag with current mouse position
 * @param options.onStart - Optional callback when drag starts
 * @param options.onEnd - Optional callback when drag ends
 * @returns Object containing handleMouseDown event handler and isDragging status
 * @example
 * const { handleMouseDown } = useMouseDrag({
 *   onDrag: (x, y) => updateColor(x, y),
 *   onStart: () => console.log('Drag started'),
 *   onEnd: () => console.log('Drag ended')
 * });
 */
export const useMouseDrag = (options: MouseDragOptions) => {
  const { onDrag, onStart, onEnd } = options;
  const isDragging = useRef(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      isDragging.current = true;

      const clientX = e.clientX;
      const clientY = e.clientY;

      // Call onStart if provided
      onStart?.(clientX, clientY);

      // Initial drag call
      onDrag(clientX, clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current) return;
        moveEvent.preventDefault();
        onDrag(moveEvent.clientX, moveEvent.clientY);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        onEnd?.();
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [onDrag, onStart, onEnd]
  );

  return { handleMouseDown, isDragging: isDragging.current };
};
