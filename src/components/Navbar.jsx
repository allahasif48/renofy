export default function Navbar() {
  return (
    <header className="nav-shell">
      <a className="brand" href="#top" aria-label="Renofy home">REN<span>O</span>FY</a>
      <nav>
        <a href="#work">Approach</a>
        <a href="#services">Services</a>
        <a href="#process">Process</a>
        <a href="#contact" className="nav-cta">Start a Project</a>
      </nav>
    </header>
  );
}
