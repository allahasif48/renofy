export default function Navbar() {
  return (
    <header className="nav-shell">
      <a className="brand" href="#top" aria-label="Renofy home">
        RENO<span>F</span>Y
        <small>Better spaces. Brighter living.</small>
      </a>
      <nav>
        <a href="#top">Home</a>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#process">Process</a>
        <a href="#contact">Contact</a>
        <a href="#contact" className="nav-cta">Start a Project <span>→</span></a>
      </nav>
    </header>
  );
}
