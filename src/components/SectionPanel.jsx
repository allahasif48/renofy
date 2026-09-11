export default function SectionPanel({ eyebrow, title, copy, points = [], align = 'left', children }) {
  return (
    <div className={`section-panel ${align === 'right' ? 'panel-right' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-copy">{copy}</p>
      {points.length > 0 && (
        <div className="service-tags">
          {points.map((point) => <span key={point}>{point}</span>)}
        </div>
      )}
      {children}
    </div>
  );
}
