import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Images from "./pages/Images";
import Media from "./pages/Media";
import Others from "./pages/Others";
import AllFiles from "./pages/AllFiles";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />

        {/* Layout for all dashboard pages */}
        <Route path="/" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="allfiles" element={<AllFiles />} />
          <Route path="documents" element={<Documents />} />
          <Route path="images" element={<Images />} /> {/* ✅ Must be here */}
          <Route path="media" element={<Media />} />
          <Route path="others" element={<Others />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
