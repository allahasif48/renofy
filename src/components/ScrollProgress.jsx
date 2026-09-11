export default function ScrollProgress({ progress }) {
  return (
    <div className="scroll-rail" aria-hidden="true">
      <div className="scroll-fill" style={{ transform: `scaleY(${Math.max(0.02, progress)})` }} />
    </div>
  );
}
