import React, { useEffect, useState } from "react";
import OfficerBrick from "../Stylesheets/OfficerBrick";
import PageHeader from "../Stylesheets/PageHeader";
import { supabase } from "../lib/supabaseClient";

interface Officer {
  id: number;
  full_name: string;
  title: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  x_social?: string;
  facebook?: string;
  photo_url?: string;
}

const OfficerPage: React.FC = () => {
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
    <div className="flex flex-col items-center justify-center">
      <title>Our Officers</title>

      <PageHeader headerText={"Our Officers"} />

      <div className="bg-[#A79877FF] w-3/4 shadow-sm items-center flex flex-wrap justify-center">
        {officers.map((o) => (
          <OfficerBrick
            key={o.id}
            officerTitle={o.title}
            officerName={o.full_name}
            officerEmail={o.email}
            officerLinkedIn={o.linkedin}
            officerInstagram={o.instagram}
            officerYoutube={o.youtube}
            officerTwitter={o.x_social}
            officerFacebook={o.facebook}
            pictureLink={o.photo_url || ""}
          />
        ))}
      </div>
    </div>
  );
};

export default OfficerPage;
