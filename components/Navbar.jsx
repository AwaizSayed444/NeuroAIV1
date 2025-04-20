import react from "react";
import logoImg from "../images/Logo.png";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img src={logoImg} alt="" width="45" height="50" />
            <label>NeuroAI</label>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              {/* <a className="nav-link" href="newChat.html">
                <img src="images/newChat1.png" alt="" width="20" height="20" />
                New Chat
              </a> */}
              {/* <a className="nav-link" href="chatHistory.html">
                <img
                  src="images/Previouschat.png"
                  alt=""
                  width="18"
                  height="18"
                />
                Previous Chat
              </a> */}
              {/* <a className="nav-link">Name of user After Login/signup</a> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
