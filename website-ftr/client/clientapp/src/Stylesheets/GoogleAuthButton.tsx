import googleLogo from "../assets/google-logo.svg";
import FTRButton from "./FTRButton";

interface User {
  user_metadata?: {
    full_name?: string;
  };
  app_metadata?: {
    roles?:{
      admin: boolean;
      editor: boolean;
      author: boolean;
    };
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
    const roles = user.app_metadata?.roles;

    const firstName =
      user.user_metadata?.full_name?.split(" ")[0] ?? "User";

    const hasRole = roles?.admin || roles?.editor || roles?.author;

    const handleRoleAction = () => {
      alert("test");
    };

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px", fontFamily: "Times New Roman"}} className="mx-2">
        <span>Welcome, {firstName}!</span>
        {hasRole && (
          <FTRButton
            onClick={handleRoleAction}
            buttonText="Role Action"
            className="mx-2"
          />
        )}

        <FTRButton
          onClick={onLogout}
          buttonText="Logout"
          className="mx-2"
        />
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
      className="me-4"
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
