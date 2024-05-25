// App.js

import React from "react";
import MapVisualization from "./components/MapVisualization";
import Header from "./components/Header";
import './index.css'
import Footer from "./components/Footer";
const App = () => {
  return (
    <div>
      <Header></Header>
      <MapVisualization />
      <Footer></Footer>
    </div>
  );
};

export default App;
