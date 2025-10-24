'use client';

export function StatusIndicator() {
  return (
    <div className="flex items-center">
      <div className="relative">
        <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </div>
    </div>
  );
}