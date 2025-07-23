import React from "react";
import img from "../assets/Logo.png";
import {Link} from "react-router-dom"
import HomeIcon from '@mui/icons-material/Home';

const Headerandnav = () => {
  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="battle">
          Search
        </div>
        <div className="d-flex battle">
          <div className="mx-2">
            <Link to="/" className="btn clear"> Home </Link>
          </div>
          <div  className="mx-2">
            <Link to="/login" className="btn clear">Login</Link>
          </div>
          <div  className="mx-2">
            <Link to="/donate" className="btn clear">Donate</Link>
          </div>
        </div>
      </div>
      <div className="my-2" style={{ backgroundColor: "#f5f1e9" }}>
        <img src={img} width="460" height="120" />
      </div>
      <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <a class="nav-link" aria-current="page" href="#">
                  News and Feautures
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Opinion-and-editorial
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Resources and Education
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Action and Advocacy
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Global Voices
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  Creative Corner
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Headerandnav;
