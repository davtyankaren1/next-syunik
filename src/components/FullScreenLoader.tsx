import React from "react";

const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <img
        src="/assets/svgs/white-logo-sign.svg"
        alt="Loading"
        className="w-24 h-24 animate-spin"
        style={{ animationDuration: "1.2s" }}
      />
    </div>
  );
};

export default FullScreenLoader;
