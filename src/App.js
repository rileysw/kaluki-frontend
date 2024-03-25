import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReadyPage from "./pages/ReadyPage";
import PlayPage from "./pages/PlayPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/ready" element={<ReadyPage />} />
      <Route path="/play" element={<PlayPage />} />
      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
