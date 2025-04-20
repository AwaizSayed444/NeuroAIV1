import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox/ChatBox";

function App() {
  const [value, setValue] = useState("");
  const [valueArr, setValueArr] = useState([
    { text: "Hey there!", type: "user" },
    { text: "Hi! How can I help you today?", type: "bot" },
    { text: "Can you tell me a joke?", type: "user" },
    {
      text: "Sure! Why don’t scientists trust atoms? Because they make up everything!",
      type: "bot",
    },
  ]);
  const upd = () => {
    setValueArr(...valueArr, { text: value, type: "user" });
  };
  return (
    <>
      <Navbar />
      <ChatBox
        value={value}
        setValue={setValue}
        setValueArr={setValueArr}
        valueArr={valueArr}
      />
    </>
  );
}

export default App;
