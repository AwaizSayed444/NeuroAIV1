import React, { useState } from "react";
import SendWhiteIcon from "../../images/SendWhiteIcon.png";
import styles from "./ChatBox.module.css";
import ChatContainer from "./ChatContainer/ChatContainer";

const ChatBox = (props) => {
  const [value, setValue] = useState("");
  const [addArr, setAddArr] = useState({});
  const [buttonState, setButtonState] = useState(false);
  const onChangeHandler = async (e) => {
    setValue(e.target.value);
    props.setValue(e.target.value);
    setAddArr({
      text: e.target.value,
      type: "user",
    });
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
        <form
          className="input-group"
          onSubmit={(e) => {
            e.preventDefault();
            if (value) {
              const newMessage = [...props.valueArr, addArr];
              props.setValueArr(newMessage);
              setButtonState(true);
            }

            setValue("");
          }}
        >
          <input
            type="text"
            value={value}
            onChange={onChangeHandler}
            className={`form-control  ${styles.chatInput}`}
            placeholder="Enter here"
            disabled={buttonState}
          />
          <button
            className="btn"
            type="submit"
            id="button-addon2"
            disabled={buttonState}
          >
            <img src={SendWhiteIcon} alt="" width="25" height="20" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;

//garbage
// onsubmit="event.preventDefault()"
// onkeydown="if(event.key === 'Enter') { sendMessage(); }"
// onclick="sendMessage()"
// {/* <div className="d-flex justify-content-between pt-1">
//             <img src="images/WhiteWebcam.png" alt="" width="20" height="20" />
//             <img
//               src="images/WhiteMic.png"
//               alt=""
//               width="16"
//               height="18"
//               className="me-3"
//             />
//           </div> */}
