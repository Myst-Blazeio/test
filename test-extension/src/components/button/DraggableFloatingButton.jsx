import React, { useState, useEffect } from "react";
import FloatingButton from "./FloatingButton";

const DraggableFloatingButton = () => {
  const [position, setPosition] = useState({ bottom: 50, right: 50 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setOffset({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    const dx = offset.x - e.clientX;
    const dy = offset.y - e.clientY;
    setPosition((prev) => ({
      bottom: prev.bottom + dy,
      right: prev.right + dx,
    }));
    setOffset({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setDragging(false);
    snapToNearestCorner();
  };

  const snapToNearestCorner = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const positions = [
      { bottom: 50, right: 50 }, // Bottom Right
      { bottom: 50, left: 50 }, // Bottom Left
      { top: 50, right: 50 }, // Top Right
      { top: 50, left: 50 }, // Top Left
    ];

    let closest = positions[0];
    let minDistance = Infinity;

    positions.forEach((pos) => {
      const x = pos.left !== undefined ? pos.left : windowWidth - pos.right;
      const y = pos.top !== undefined ? pos.top : windowHeight - pos.bottom;
      const btnX =
        pos.left !== undefined
          ? windowWidth - position.right
          : position.left || windowWidth - position.right;
      const btnY =
        pos.top !== undefined
          ? windowHeight - position.bottom
          : position.top || windowHeight - position.bottom;

      const distance = Math.hypot(x - btnX, y - btnY);

      if (distance < minDistance) {
        minDistance = distance;
        closest = pos;
      }
    });

    setPosition(closest);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: position.bottom,
        right: position.right,
        top: position.top,
        left: position.left,
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <FloatingButton />
    </div>
  );
};

export default DraggableFloatingButton;
