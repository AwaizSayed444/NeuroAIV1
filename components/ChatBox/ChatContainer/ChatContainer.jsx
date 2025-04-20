import React, { useEffect } from "react";
import styles from "./ChatContainer.module.css";
import axios from "axios";

const ChatContainer = (props) => {
  useEffect(() => {
    const getResponse = async () => {
      if (!props.value) return; // No user input

      // Check if the user wants to exit
      if (["exit", "quit", "stop", "end"].includes(props.value.toLowerCase())) {
        const addReply = {
          text: "The conversation has ended. Thank you for chatting!",
          type: "bot",
        };
        const newMessage = [...props.valueArr, addReply];
        props.setValueArr(newMessage);
        props.setButtonState(true); // Disable input after exit
        return;
      }

      // Send the user input to the backend for prediction
      const data = await axios.post("http://localhost:8000/predict", {
        message: props.value,
      });

      const { reply, questions, finished } = data.data;

      // Add the bot's reply to the chat
      const addReply = { text: reply, type: "bot" };
      const newMessage = [...props.valueArr, addReply];
      props.setValueArr(newMessage);

      if (!finished) {
        // If more questions are available, continue asking
        const nextMessage = questions.length > 0 ? questions[0] : "";
        if (nextMessage) {
          const addQuestion = { text: nextMessage, type: "bot" };
          const newMessageWithQuestion = [...newMessage, addQuestion];
          props.setValueArr(newMessageWithQuestion);
        }
      }
    };

    if (props.value && !props.inputValue) {
      getResponse();
      props.setButtonState(false);
    }
  }, [props.value, props.inputValue]);

  return (
    <>
      <div
        className={`bg-dark mb-2 overflow-auto ${styles.chatContainer}`}
        name="chatContainer"
      >
        {props.valueArr.map((msg, index) => (
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
    </>
  );
};

export default ChatContainer;
