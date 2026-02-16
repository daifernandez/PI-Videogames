import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ToastProvider } from "./hooks/useToast";
import useTheme from "./hooks/useTheme";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import ToastContainer from "./components/Toast.jsx";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import VideogameDetail from "./components/VideogameDetail.jsx";
import PlatformGames from "./components/PlatformGames.jsx";

export default function App() {
  useTheme();

  return (
    <ToastProvider>
      <div className="App">
        <SkipToContent />
        <ErrorBoundary>
          <div className="main-content" id="main-content" tabIndex="-1">
            <Routes>
              <Route exact path="/" element={<Landing />} />
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/videogame/:id" element={<VideogameDetail />} />
              <Route exact path="/platform/:platform" element={<PlatformGames />} />
            </Routes>
          </div>
        </ErrorBoundary>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
