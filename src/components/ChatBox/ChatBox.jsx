import React, { useState } from "react";
import SendWhiteIcon from "../../images/SendWhiteIcon.png";
import styles from "./ChatBox.module.css";
import ChatContainer from "./ChatContainer/ChatContainer";

const ChatBox = (props) => {
  const [value, setValue] = useState("");
  const [addArr, setAddArr] = useState({});
  const [buttonState, setButtonState] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true); // <-- NEW

  const onChangeHandler = (e) => {
    setValue(e.target.value);
    props.setValue(e.target.value);
    setAddArr({
      text: e.target.value,
      type: "user",
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
  
    const userMsg = { text: value, type: "user" };
    const updatedMessages = [...props.valueArr, userMsg];
    props.setValueArr(updatedMessages);
    setValue(""); // Clear input
    setButtonState(true);
  
    // Send to backend
    try {
      const response = await fetch("http://localhost:8000/next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: value.trim(),
          questions: props.questions || [],
        }),
      });
  
      const data = await response.json();
  
      props.setValueArr((prev) => [
        ...prev,
        { text: data.reply, type: "bot" },
      ]);
  
      if (data.finished) {
        // Only stop session if 'finished' is returned from the backend, and user has not explicitly ended the session
        if (["exit", "quit", "stop", "end"].includes(value.toLowerCase())) {
          setIsSessionActive(false); // ⛔️ Stop session
          setButtonState(true); // Lock input
        }
      } else {
        // Continue with next question set
        if (data.questions) props.setQuestions(data.questions);
        setButtonState(false); // Allow next input
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const restartSession = () => {
    setIsSessionActive(true);
    setValue("");
    props.setValueArr([]);
    props.setQuestions([]);
    setButtonState(false);
  };

  return (
    <div
      className={`d-flex flex-column justify-content-center align-items-center ${styles.chatWrapper}`}
    >
      <ChatContainer
        valueArr={props.valueArr}
        value={props.value}
        setButtonState={setButtonState}
        inputValue={value}
        setValueArr={props.setValueArr}
      />

      <div className={`rounded p-1 ${styles.chatInputWrapper}`}>
        <form className="input-group" onSubmit={handleSend}>
          <input
            type="text"
            value={value}
            onChange={onChangeHandler}
            className={`form-control  ${styles.chatInput}`}
            placeholder={
              isSessionActive ? "Enter here" : "Session ended. Click restart."
            }
            disabled={!isSessionActive || buttonState}
          />
          <button
            className="btn"
            type="submit"
            id="button-addon2"
            disabled={!isSessionActive || buttonState}
          >
            <img src={SendWhiteIcon} alt="" width="25" height="20" />
          </button>
        </form>
      </div>

      {!isSessionActive && (
        <button className="btn btn-outline-light mt-3" onClick={restartSession}>
          Restart Session
        </button>
      )}
    </div>
  );
};

export default ChatBox;
