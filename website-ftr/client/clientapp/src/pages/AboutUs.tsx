import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // <-- make sure path is correct
import OfficerBrick from "../Stylesheets/OfficerBrick";

interface Officer {
  id: number;
  full_name: string;
  title: string;
  email?: string;
  location?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
  x_social?: string;
  facebook?: string;
  photo_url?: string;
}

const AboutUs: React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      const { data, error } = await supabase
        .from("officers")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching officers:", error);
      } else {
        setOfficers(data || []);
      }

      setLoading(false);
    };

    fetchOfficers();
  }, []);

  if (loading) return <p>Loading officers...</p>;

  return (
    <div>
      <title>About Us</title>
      <h1>About Us</h1>

      <div className="officer-container">
        {officers.map((officer) => (
          <OfficerBrick
            key={officer.id}
            officerName={officer.full_name}
            officerTitle={officer.title}
            officerEmail={officer.email}
            officerYoutube={officer.youtube}
            officerLinkedIn={officer.linkedin}
            officerInstagram={officer.instagram}
            officerTwitter={officer.x_social}
            officerFacebook={officer.facebook}
            pictureLink={officer.photo_url || ""} // <= now uses real URL from DB
          />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
