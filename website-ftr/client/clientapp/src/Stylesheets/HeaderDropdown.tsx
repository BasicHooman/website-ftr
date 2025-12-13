import HomeIcon from "@mui/icons-material/Home";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CoolDropdown from "./CoolDropdown";
import front_logo from '../assets/big-ftr-logo.png';
import { supabase } from "../lib/supabaseClient";
import type {User, Session} from "@supabase/supabase-js";

interface HeaderDropdownProps {
  selectedValue?: string;
}

const HeaderDropdown = React.forwardRef<HTMLDivElement, HeaderDropdownProps>(
  ({ selectedValue }, ref) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null >(null);

    // Fetch session
    useEffect(() => {
      const loadUser = async () => {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user ?? null);
      };

      loadUser();

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (_event, session: Session | null) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }, []);


    // LOGIN
    const handleLogin = async () => {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
    };

    // LOGOUT
    const handleLogout = async () => {
      await supabase.auth.signOut();
      setUser(null);
    };

    const categoryDropdownOptions = [
      { value: "news", label: "News and Features", path: "/category/news-and-features" },
      { value: "opinion", label: "Opinion and Editorial", path: "/category/opinion-and-editorial" },
      { value: "resources", label: "Resources and Education", path: "/category/resources-and-education" },
      { value: "action", label: "Action and Advocacy", path: "/category/action-and-advocacy" },
      { value: "global", label: "Global Voices", path: "/category/global-voices" },
    ];

    const aboutUsDowndownOptions = [
      { value: "about", label: "About Us", path: "/about-us" },
      { value: "officers", label: "Our Officers", path: "/officers" },
    ];

    const handleDropNavigate = (optionList: Array<{value: string; label: string; path: string; }>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedOption = optionList.find((opt) => opt.value === e.target.value);
      if (selectedOption?.path) navigate(selectedOption.path);
    };

    return (
      <div ref={ref} className="fixed top-0 w-full z-50 bg-white">
        <div className="d-flex justify-content-center">
          <div className="d-flex battle">
            <div className="mx-2">
              {user ? (
                <div className="d-flex align-items-center">
                  <span className="mx-2">
                    Welcome, {user.user_metadata.full_name?.split(" ")[0] ?? "User"}
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
          <img src={front_logo} width="306" height="100" />
        </div>
        
        <div>
          <nav className="navbar navbar-expand-lg navbar-bottom-shadow">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="navbar navbar-collapse justify-center items-center" id="navbarNav">
                <ul className="navbar-nav mx-auto justify-center">
                  <CoolDropdown
                    dropdownLabelTitle="Categories"
                    options={categoryDropdownOptions}
                    selectedValue={selectedValue}
                    onChange={handleDropNavigate(categoryDropdownOptions)}
                  />
                  <CoolDropdown
                    dropdownLabelTitle="About Us"
                    options={aboutUsDowndownOptions}
                    selectedValue={selectedValue}
                    onChange={handleDropNavigate(aboutUsDowndownOptions)}
                  />
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    );
  }
);

export default HeaderDropdown;
