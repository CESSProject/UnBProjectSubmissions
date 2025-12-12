export function MedVaultLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  const primaryBlue = "#3B82F6" // hsl(221.2 83.2% 53.3%)
  const accentCyan = "#06B6D4" // cyan accent

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Background - filled shield for better visual presence */}
      <path
        d="M100 20L160 45V95C160 140 100 175 100 175C100 175 40 140 40 95V45L100 20Z"
        fill={primaryBlue}
        opacity="0.1"
      />

      {/* Shield Border */}
      <path
        d="M100 20L160 45V95C160 140 100 175 100 175C100 175 40 140 40 95V45L100 20Z"
        stroke={primaryBlue}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Medical Cross - large centered cross symbolizing healthcare */}
      <g stroke={accentCyan} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Vertical line of cross */}
        <line x1="100" y1="60" x2="100" y2="140" />
        {/* Horizontal line of cross */}
        <line x1="75" y1="100" x2="125" y2="100" />
      </g>

      {/* Accent dots for blockchain element - kept as security/tech accent */}
      <circle cx="145" cy="60" r="2.5" fill={accentCyan} />
      <circle cx="55" cy="60" r="2.5" fill={accentCyan} />
      <circle cx="150" cy="130" r="2.5" fill={accentCyan} />
      <circle cx="50" cy="130" r="2.5" fill={accentCyan} />
    </svg>
  )
}
