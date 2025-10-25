interface FernsehturmProps {
  className?: string;
  size?: number;
}

export function Fernsehturm({ className = "", size = 24 }: FernsehturmProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className}
    >
      {/* Sphere/Ball */}
      <circle cx="50" cy="25" r="8" fill="currentColor" />
      
      {/* Antenna top */}
      <rect x="49" y="10" width="2" height="15" fill="currentColor" />
      
      {/* Main tower body */}
      <rect x="48" y="33" width="4" height="50" fill="currentColor" />
      
      {/* Tower base */}
      <rect x="46" y="83" width="8" height="6" fill="currentColor" />
      
      {/* Restaurant section (wider part) */}
      <rect x="45" y="40" width="10" height="8" fill="currentColor" />
      
      {/* Small details/windows */}
      <rect x="46" y="42" width="1" height="1" fill="white" />
      <rect x="48" y="42" width="1" height="1" fill="white" />
      <rect x="50" y="42" width="1" height="1" fill="white" />
      <rect x="52" y="42" width="1" height="1" fill="white" />
      <rect x="53" y="42" width="1" height="1" fill="white" />
    </svg>
  );
}