import React from "react";

import logo from "./logo.svg";
import { animate } from "./space";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <canvas width="1000" height="600" ref={animate} />
      </header>
    </div>
  );
}

export default App;
