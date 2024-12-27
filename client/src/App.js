import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import CreateVideogame from "./components/CreateVideogame.jsx";
import VideogameDetail from "./components/VideogameDetail.jsx";
import Platform from "./components/Platform.jsx";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/createVideogame" element={<CreateVideogame />} />
        <Route exact path="/videogame/:id" element={<VideogameDetail />} />
        <Route exact path="/videogames/platform/:name" element={<Platform />} />
      </Routes>
    </div>
  );
}
