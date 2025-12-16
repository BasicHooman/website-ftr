import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface TestingStyles {
  fun: string;
}

export const TestingStyles: React.FC<TestingStyles> = () => {
  const [message, setMessage] = useState("");

  // --- SEED ARTICLES INTO SUPABASE ---
  const handleSeed = async () => {
    try {
      // Example seed articles
      const seedData = [
        {
          title: "Sample Article 1",
          summary: "This is a debug seeded article.",
          content: { type: "doc", content: [] },
          image_url: "",
          genre: "news",
          author_id: (await supabase.auth.getUser()).data.user?.id || null,
        },
        {
          title: "Sample Article 2",
          summary: "Another example seeded article.",
          content: { type: "doc", content: [] },
          image_url: "",
          genre: "opinion",
          author_id: (await supabase.auth.getUser()).data.user?.id || null,
        },
      ];

      const { error } = await supabase.from("articles").insert(seedData);

      if (error) {
        console.error(error);
        setMessage("Error seeding articles.");
      } else {
        setMessage("Seeded articles successfully!");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred.");
    }
  };

  // --- CLEAR ARTICLES FROM SUPABASE ---
  const handleClear = async () => {
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .neq("id", 0); // deletes ALL articles

      if (error) {
        console.error(error);
        setMessage("Error deleting articles.");
      } else {
        setMessage("Cleared all seeded articles.");
      }
    } catch (e) {
      console.error(e);
      setMessage("An error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <title>Debug Tools</title>

      <div className="my-4 p-4 border rounded">
        <h3 className="text-center mb-2">Database Seeding</h3>
        <div className="d-flex justify-content-center">
          <button className="btn btn-primary mx-2" onClick={handleSeed}>
            Seed Articles
          </button>
          <button className="btn btn-danger mx-2" onClick={handleClear}>
            Clear Seeded Articles
          </button>
        </div>
        {message && <p className="mt-3 text-center">{message}</p>}
      </div>

      <Link className="nav-link" to="/create">
        Create Article
      </Link>
    </div>
  );
};

export default TestingStyles;
