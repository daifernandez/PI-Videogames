import Social from "./Social";
import "./Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-section">
        <span className="footer-text">Individual Project - Videogame App</span>{" "}
        <span className="footer-text">Henry Bootcamp Projects - 2022</span>
      </div>
      <div className="footer-social">
        <span className="footer-text">Hecho con ❤️ por Dai.</span>
        <Social />
      </div>
    </footer>
  );
}
