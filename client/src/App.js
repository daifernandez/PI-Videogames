import "./App.css";
import { Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import CreateVideogame from "./components/CreateVideogame.jsx";
import VideogameDetail from "./components/VideogameDetail.jsx";
import Platform from "./components/Platform.jsx";

export default function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Landing} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/createVideogame" component={CreateVideogame} />
      <Route exact path="/videogame/:id" component={VideogameDetail} />
      <Route exact path="/videogames/platform/:name" component={Platform} />
    </div>
  );
}
