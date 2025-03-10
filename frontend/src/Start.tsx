import React from "react";
type StartProps = {
  setMode: React.Dispatch<React.SetStateAction<String>>;
};

function Start(props: StartProps) {
  const { setMode } = props;

  return (
    <div className="flex flex-row h-screen w-screen justify-center">
      {" "}
      {/* kept the background white */}
      <div className="h-full flex flex-col sm:items-center items-start justify-center gap-4">
        <div className="sm:text-7xl text-blue-900 text-5xl p-1">
          Million Dollar Funnel Assessment
        </div>
        <div className="text-blue-900 text-lg p-1">
          This assessment will only take you a minute!
        </div>
        <button
          onClick={() => setMode("questions")}
          className="text-white text-3xl bg-blue-600 hover:bg-blue-900 w-full p-3 rounded"
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Start;
