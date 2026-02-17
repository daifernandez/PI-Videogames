import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastProvider } from "./hooks/useToast";
import useTheme from "./hooks/useTheme";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SkipToContent from "./components/SkipToContent.jsx";
import TopProgressBar from "./components/TopProgressBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import ToastContainer from "./components/Toast.jsx";
import Landing from "./components/Landing.jsx";
import Home from "./components/Home.jsx";
import VideogameDetail from "./components/VideogameDetail.jsx";
import PlatformGames from "./components/PlatformGames.jsx";

export default function App() {
  useTheme();
  const location = useLocation();

  return (
    <ToastProvider>
      <div className="App">
        <TopProgressBar />
        <SkipToContent />
        <ErrorBoundary>
          <div className="main-content" id="main-content" tabIndex="-1">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Routes location={location}>
                  <Route path="/" element={<Landing />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/videogame/:id" element={<VideogameDetail />} />
                  <Route path="/platform/:platform" element={<PlatformGames />} />
                </Routes>
              </PageTransition>
            </AnimatePresence>
          </div>
        </ErrorBoundary>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
