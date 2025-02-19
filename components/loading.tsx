import React from "react";

const Loading = ({ className }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default Loading;
