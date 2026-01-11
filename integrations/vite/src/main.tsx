import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { DecoderRoute } from "./routes/Decoder";
import { HomeRoute } from "./routes/Home";
import { GridRoute } from "./routes/Grid";
import { ListRoute } from "./routes/List";

import "./tailwind.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/list" element={<ListRoute />} />
        <Route path="/grid" element={<GridRoute />} />
        <Route path="/decoder/:encoded" element={<DecoderRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
