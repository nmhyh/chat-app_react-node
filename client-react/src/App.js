import Chat from "./chat/chat";
import Process from "./process/process";
import Home from "./home/home";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.scss";
import React from "react";
import io from "socket.io-client";

const socket = io.connect('/');

const Appmain = () => {
  const location = useLocation();
  const url = location.pathname;
  console.log('2', url.split('/'));
  const username = location.pathname.split('/')[3];
  const roomname = location.pathname.split('/')[1];
  return (
    <React.Fragment>
      <div className="right">
        <Chat
          username={username}
          roomname={roomname}
          socket={socket}
        />
      </div>
      <div className="left">
        <Process />
      </div>
    </React.Fragment>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home socket={socket} />} exact>
          </Route>
          <Route path="/chat/:roomname/:username"
            element={<Appmain />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;