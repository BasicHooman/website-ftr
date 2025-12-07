import { useState, useEffect } from "react";
import img from "../assets/big-ftr.png";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { supabase } from "../lib/supabaseClient";

const Headerandnav: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    loadUser();

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="battle">Search</div>

        <div className="d-flex battle">
          <div className="mx-2">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="mx-2">
                  Welcome, {user.user_metadata.full_name?.split(" ")[0]}
                </span>
                <button onClick={handleLogout} className="btn btn-primary">
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleLogin}>
                Sign in with Google
              </button>
            )}
          </div>

          <div className="mx-2">
            <Link to="/donate" className="btn clear">
              Donate
            </Link>
          </div>

          <div className="mx-2">
            <Link to="/" className="btn clear">
              <HomeIcon />
            </Link>
            <Link to="/testing-styles" className="btn clear">
              Format Testing
            </Link>
          </div>
        </div>
      </div>

      <div className="my-2 text-center" style={{ backgroundColor: "#f5f1e9" }}>
        <img src={img} className={"w-3/4 h-1/4"} />
      </div>

      <nav className="navbar navbar-expand-lg navbar-bottom-shadow">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/category/news-and-features">
                  News and Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/opinion-and-editorial">
                  Opinion and Editorial
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/resources-and-education">
                  Resources and Education
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/action-and-advocacy">
                  Action and Advocacy
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/global-voices">
                  Global Voices
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  About
                </button>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/about-us">About Us</Link></li>
                  <li><Link className="dropdown-item" to="/officers">Officers</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/create">
                  Creative Corner
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Headerandnav;
