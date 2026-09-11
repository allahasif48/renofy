export default function Navbar() {
  return (
    <header className="nav-shell">
      <a className="brand" href="#top" aria-label="Renofy home">REN<span>O</span>FY</a>
      <nav>
        <a href="#kitchen">Kitchen</a>
        <a href="#bathroom">Bathroom</a>
        <a href="#basement">Basement</a>
        <a href="#contact" className="nav-cta">Get a Quote</a>
      </nav>
    </header>
  );
}
