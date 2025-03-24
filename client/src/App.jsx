import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ChatAppUI from "./components/ChatUi";

import axios from "axios";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ChatAppUI />
    </>
  );
}

export default App;
