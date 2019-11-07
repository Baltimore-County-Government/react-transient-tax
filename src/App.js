import React from "react";
import "./App.scss";
import ReturnInterval from "./components/ReturnInterval";

function App() {
  return (
    <div className="App">
      <ReturnInterval intervalType="monthly" />
    </div>
  );
}

export default App;
