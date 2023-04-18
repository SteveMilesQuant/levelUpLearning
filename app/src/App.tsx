import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Camps from "./pages/Camps";
import Programs from "./pages/Programs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<Students />} />
          <Route path="camps" element={<Camps />} />
          <Route path="programs" element={<Programs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
