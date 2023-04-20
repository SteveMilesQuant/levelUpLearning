import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Students from "./students/pages/Students";
import Camps from "./camps/pages/Camps";
import Programs from "./programs/pages/Programs";
import Program from "./programs/pages/Program";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="students" element={<Students />} />
          <Route path="camps" element={<Camps />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programs/:id" element={<Program />} />
          <Route path="schedule" element={<Camps forScheduling={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
