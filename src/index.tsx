import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { getRepId } from "./util/getRepId";
import { getToken } from "./component/ClientToken";

import "./index.css";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App
      repId={getRepId()}
      root="https://codechallenge.rivet.work/api/v1"
      token={getToken()}
    />
  </React.StrictMode>
);
