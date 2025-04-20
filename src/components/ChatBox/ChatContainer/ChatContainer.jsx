import React, { useEffect } from "react";
import styles from "./ChatContainer.module.css";
import axios from "axios";

const ChatContainer = (props) => {
  useEffect(() => {
    const getResponse = async () => {
      const data = await axios.get("https://picsum.photos/v2/list"); //Attach Backend link here
      const url = data.data[Math.floor(Math.random() * 30)].download_url;
      console.log("Fetched image URL:", url);

      const add = { text: url, type: "bot" };
      const newMessage = [...props.valueArr, add];
      props.setValueArr(newMessage);
    };

    if (!props.inputValue && props.value) {
      getResponse();
      props.setButtonState(false);
    }
  }, [props.inputValue, props.value]);

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
