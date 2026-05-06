import "../styles/StatusBar.css";

interface StatusBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  isPercentage?: boolean;
  customPrefix?: string;
  customSuffix?: string;
}

export function StatusBar({
  label,
  value,
  max,
  color,
  isPercentage = true,
  customPrefix,
  customSuffix,
}: StatusBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="status-bar">
      <span className="status-bar__label">{label}</span>
      <div className="status-bar__track">
        <div
          className="status-bar__fill"
          style={{
            width: `${percentage}%`,
            background: color,
          }}
        />
      </div>
      <span className="status-bar__value" style={{ color }}>
        {customPrefix}
        {value}
        {isPercentage && <span>%</span>}
        {customSuffix}
      </span>
    </div>
  );
}
