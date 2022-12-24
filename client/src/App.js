import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import CreateVideogame from "./components/CreateVideogame.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route exact path="/" component={Landing} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/createVideogame" component={CreateVideogame} />
      </BrowserRouter>
    </div>
  );
}

export default App;
