'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const DraggableScrollBar = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [barHeight, setBarHeight] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  // Calculate scroll bar height and position based on content
  useEffect(() => {
    const updateScrollBar = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPercentage = scrollY / (documentHeight - windowHeight);
      
      // Calculate the height of the scroll bar based on content ratio
      const calculatedBarHeight = Math.max(30, (windowHeight / documentHeight) * windowHeight);
      setBarHeight(calculatedBarHeight);
      
      // Calculate the position of the scroll bar
      const maxScroll = windowHeight - calculatedBarHeight;
      const newPosition = scrollPercentage * maxScroll;
      setScrollPosition(newPosition);
    };

    // Initial calculation
    updateScrollBar();

    // Add event listeners
    window.addEventListener('scroll', updateScrollBar);
    window.addEventListener('resize', updateScrollBar);

    return () => {
      window.removeEventListener('scroll', updateScrollBar);
      window.removeEventListener('resize', updateScrollBar);
    };
  }, []);

  // Handle mouse drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle touch drag events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !barRef.current) return;

    const windowHeight = window.innerHeight;
    const maxScroll = windowHeight - barHeight;
    const minY = 0;
    const maxY = maxScroll;
    
    let newTop = e.clientY - barRef.current.offsetHeight / 2;
    newTop = Math.max(minY, Math.min(newTop, maxY));

    // Calculate scroll position based on bar position
    const scrollPercentage = newTop / maxScroll;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTo = scrollPercentage * documentHeight;

    window.scrollTo({ top: scrollTo, behavior: 'auto' });
    setScrollPosition(newTop);
  }, [isDragging, barHeight]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !barRef.current || !e.touches[0]) return;

    const windowHeight = window.innerHeight;
    const maxScroll = windowHeight - barHeight;
    const minY = 0;
    const maxY = maxScroll;
    
    let newTop = e.touches[0].clientY - barRef.current.offsetHeight / 2;
    newTop = Math.max(minY, Math.min(newTop, maxY));

    // Calculate scroll position based on bar position
    const scrollPercentage = newTop / maxScroll;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTo = scrollPercentage * documentHeight;

    window.scrollTo({ top: scrollTo, behavior: 'auto' });
    setScrollPosition(newTop);
  }, [isDragging, barHeight]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add mouse and touch event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, barHeight, handleMouseMove, handleTouchMove]);

  return (
    <div className="draggable-scrollbar">
      <div
        ref={barRef}
        className="scroll-thumb"
        style={{
          height: `${barHeight}px`,
          top: `${scrollPosition}px`,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      />
    </div>
  );
};

export default DraggableScrollBar;