import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface Officer {
  id: number;
  full_name: string;
  title: string;
  photo_url: string;
  description: string;
  email: string;
}

const AdminDashboard = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // AUTH CHECK + LOAD INITIAL DATA
  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return navigate("/");

      // Check admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        return navigate("/admin ");
      }

      // Load officers
      const { data: o } = await supabase
        .from("officers")
        .select("*")
        .order("id", { ascending: true });

      setOfficers(o || []);
      setLoading(false);
    })();
  }, []);

  // ADD OFFICER
  const addOfficer = async () => {
    const name = prompt("Officer name:");

    if (!name) return;

    const { error } = await supabase.from("officers").insert({
      full_name: name,
      title: "New Officer",
      photo_url: "",
      description: "",
      email: ""
    });

    if (error) {
      alert("Failed to add officer.");
      return;
    }

    const { data: updated } = await supabase
      .from("officers")
      .select("*")
      .order("id");

    setOfficers(updated || []);
  };

  // DELETE OFFICER
  const deleteOfficer = async (id: number) => {
    if (!confirm("Are you sure you want to delete this officer?")) return;

    await supabase.from("officers").delete().eq("id", id);

    setOfficers((old) => old.filter((o) => o.id !== id));
  };

  
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r p-6 flex flex-col shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-4">
          <span className="font-semibold text-gray-700">Officers</span>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to Site
          </Link>

          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 text-white py-2 rounded-lg"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Manage Officers</h2>
          <button
            onClick={addOfficer}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            + Add Officer
          </button>
        </div>

        {/* OFFICER LIST */}
        <div className="bg-white rounded-xl shadow p-6">

          {/* Empty state */}
          {officers.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No officers found.
            </p>
          )}

          {/* Officer Items */}
          {officers.map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between border-b py-4 last:border-b-0"
            >
              <div>
                <p className="text-lg font-semibold">{o.full_name}</p>
                <p className="text-gray-500 text-sm">{o.title}</p>
              </div>

              <button
                onClick={() => deleteOfficer(o.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
