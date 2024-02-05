import React from "react";
import "./App.css";
import Sum from "./Sum";
import ImageUpload from "./imageUpload";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ImageUpload />
        <p>This is my Image Classification app</p>
      </header>
      Learn React
    </div>
  );
}

export default App;
