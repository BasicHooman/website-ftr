import googleLogo from "../assets/google-logo.svg";

interface User {
  user_metadata?: {
    full_name?: string;
  };
}

interface GoogleAuthButtonProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const GoogleAuthButton = ({
  user,
  onLogin,
  onLogout,
}: GoogleAuthButtonProps) => {
  if (user) {
    const firstName =
      user.user_metadata?.full_name?.split(" ")[0] ?? "User";

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span>Welcome, {firstName}</span>
        <button
          onClick={onLogout}
          style={{
            padding: "8px 14px",
            borderRadius: "4px",
            border: "1px solid #dadce0",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onLogin}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        color: "#3c4043",
      }}
      onMouseOver={(e) =>
        (e.currentTarget.style.backgroundColor = "#f7f8f8")
      }
      onMouseOut={(e) =>
        (e.currentTarget.style.backgroundColor = "#ffffff")
      }
    >
      <img
        src={googleLogo}
        alt="Google logo"
        style={{ width: "18px", height: "18px" }}
      />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleAuthButton;
