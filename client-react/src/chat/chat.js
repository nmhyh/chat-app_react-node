import "./chat.scss";
// import { to_Decrypt, to_Encrypt } from "../aes.js";
import { process } from "../store/action/index";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
//gets the data from the action object and reducers defined earlier
function Chat({ username, roomname, socket }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  
  const dispatchProcess = (encrypt, msg, cipher) => {
    dispatch(process(encrypt, msg, cipher));
  };

  useEffect(() => {
    socket.on("message", (data) => {
      //decypt the message
      const ans = data.text;
      dispatchProcess(false, ans, data.text);
      console.log(ans);
      let temp = messages;
      temp.push({
        userId: data.userId,
        username: data.username,
        text: ans,
      });
      setMessages([...temp]);
    });
    setCount(count + 1);
  }, [socket]);

  const sendData = () => {
    if (text) {
      //encrypt the message here
      const ans = text;
      socket.emit("chat", ans);
      setText("");
      setCount(count + 1);
    }
  };
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  console.log(messages, "mess", count);
  const listItems = messages.map((i) => {
    if (i.username === username) {
      console.log(count + i.username + i.text);
      return (
        <div className="message"
          key="{(count + i.username + i.text).toString()}">
          <p>{i.text}</p>
          <span>{i.username}</span>
        </div>
      );
    } else {
      console.log(count + i.username + i.text);
      return (
        <div className="message mess-right"
          key="{(count + i.username + i.text).toString()}">
          <p>{i.text} </p>
          <span>{i.username}</span>
        </div>
      );
    }
  });

  return (
    <div className="chat">
      <div className="user-name">
        <h2>
          {username} <span style={{ fontSize: "0.7rem" }}>in {roomname}</span>
        </h2>
      </div>
      <div className="chat-message">
        {listItems}
        <div ref={messagesEndRef} />
      </div>
      <div className="send">
        <input
          placeholder="enter your message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendData();
            }
          }}
        ></input>
        <button onClick={sendData}>Send</button>
      </div>
    </div>
  );
}
export default Chat;