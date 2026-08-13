import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: Array<"admin" | "editor" | "author">;
}

const RequireRole: React.FC<RequireRoleProps> = ({ children, allowedRoles }) => {

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const rolesKey = allowedRoles.join(",");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Fetch user's profile to check roles
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        const metadataRoles = (session.user.app_metadata?.roles || {}) as Record<string, boolean>;

        // is the user wasting my fucking time?
        const hasRole = allowedRoles.some((role) => {
          const profileFlag = profile ? (profile)[role] === true : false;
          const profileRoleString = profile ? (profile).role === role : false;
          const metadataFlag = metadataRoles[role] === true;

          return profileFlag || profileRoleString || metadataFlag;
        });

        setAuthorized(hasRole);
      } catch (err) {
        //in essence, someone's a bitch
        alert("Auth Check Error. Please try again later.");
        console.error("Auth check error:", err);
        setAuthorized(false);
      } finally {
        // aughh finally...i finished...mghghhhffff
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles, rolesKey]);

  if (loading) {
    return (
      // so basically i would think it would be really cute if at some point we added a loading screen.
      <div className="flex items-center justify-center min-h-screen bg-[#f5f1e9]">
        <p className="text-gray-600 font-times italic">Verifying credentials...</p>
      </div>
    );
  }

  if (!authorized) {
    // haha get fucked
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
