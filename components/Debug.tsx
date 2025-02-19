import { useState } from "react";

interface IDebugProps {
  enable?: boolean;
  heading?: string;
  data?: any;
  Component?: React.FC;
}

const Debug = ({
  enable: InitialEnable = false,
  heading = "",
  data: debugData,
  Component,
}: IDebugProps) => {
  const [enable, setEnable] = useState(InitialEnable);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    });
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      e.target.style.left = `${e.clientX - offset.x}px`;
      e.target.style.top = `${e.clientY - offset.y}px`;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  function close() {
    setEnable(false);
  }

  if (!enable) return <></>;

  return (
    <pre
      style={{
        textAlign: "left",
        position: "fixed",
        top: "0",
        right: "0",
        maxWidth: "500px",
        background: "#242424",
        color: "white",
        height: "500px",
        overflow: "auto",
        border: "2px solid red",
        borderRadius: "8px",
        maxHeight: "500px",
        width: "100%",
        zIndex: 99999999999999,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          padding: "5px",
          fontSize: "16px",
          background: "black",
          width: "100%",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {heading}
        <div
          onClick={close}
          style={{ background: "red", padding: "5px", cursor: "pointer" }}
        >
          CLOSE
        </div>
      </div>
      {Component && <Component />}
      <code>{JSON.stringify(debugData, null, 2)}</code>
    </pre>
  );
};

export default Debug;
