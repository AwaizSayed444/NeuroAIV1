import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ChatBox from "./components/ChatBox/ChatBox";

function App() {
  const [value, setValue] = useState("");
  const [valueArr, setValueArr] = useState([]);
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
