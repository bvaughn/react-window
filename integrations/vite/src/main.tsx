import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { DecoderRoute } from "./routes/Decoder";
import { HomeRoute } from "./routes/Home";

import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/decoder/:encoded" element={<DecoderRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
