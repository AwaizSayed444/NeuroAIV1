import React, { useEffect } from "react";
import styles from "./ChatContainer.module.css";
import axios from "axios";

const ChatContainer = (props) => {
  useEffect(() => {
    console.log("Triggered ChatContainer useEffect:", {
      value: props.value,
      inputValue: props.inputValue,
      valueArr: props.valueArr,
    });
    const getResponse = async () => {
      if (!props.value?.trim()) return;
  
      const exitCommands = ["exit", "quit", "stop", "end"];
      const lowerValue = props.value.toLowerCase();
  
      if (exitCommands.includes(lowerValue)) {
        const addReply = {
          text: "The conversation has ended. Thank you for chatting!",
          type: "bot",
        };
        const newMessage = [...(props.valueArr || []), addReply];
        props.setValueArr(newMessage);
  
        // ONLY disable if it's not already reset
        if (props.setButtonState) props.setButtonState(true);
        return;
      }
  
      // Prevent re-triggering when input is cleared
      if (
        props.inputValue || // block if still mid-typing
        (Array.isArray(props.valueArr) &&
          props.valueArr.length > 0 &&
          props.valueArr[props.valueArr.length - 1]?.type === "bot")
      ) {
        return;
      }
  
      try {
        const data = await axios.post("http://localhost:8000/predict", {
          message: props.value,
        });
  
        const { reply, questions, finished } = data.data;
  
        const addReply = { text: reply, type: "bot" };
        const newMessage = [...(props.valueArr || []), addReply];
        props.setValueArr(newMessage);
  
        if (!finished && questions?.length > 0) {
          const addQuestion = { text: questions[0], type: "bot" };
          props.setValueArr([...newMessage, addQuestion]);
        }
  
        if (props.setButtonState) props.setButtonState(false); // ✅ Enable after bot responds
      } catch (error) {
        console.error("Error fetching response:", error);
      }
    };
  
    // Only run when there is new input and it's not mid-typing
    if (props.value && !props.inputValue && props.value.trim() !== "") {
      getResponse();
    }
  }, [props.value, props.inputValue]);
  return (
    <div
      className={`bg-dark mb-2 overflow-auto ${styles.chatContainer}`}
      name="chatContainer"
    >
      {props.valueArr?.map((msg, index) => (
        <div
          key={index}
          className={`d-flex ${
            msg.type === "user"
              ? "justify-content-end"
              : "justify-content-start"
          }`}
        >
          <label
            className={`p-2 my-2 rounded ${
              msg.type === "user" ? "ms-3" : "me-3"
            }`}
            style={{
              color: "white",
              backgroundColor: msg.type === "user" ? "#7b42dc" : "#1b67ae",
            }}
          >
            {msg.text}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
