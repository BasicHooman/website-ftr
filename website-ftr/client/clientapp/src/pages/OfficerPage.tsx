import React, { useEffect, useState } from "react";
import OfficerBrick from "../Stylesheets/OfficerBrick";
import { supabase } from "../lib/supabaseClient";
import ReaganPicture from "../assets/officer-pictures/rms.jpeg";
import MayaPicture from "../assets/officer-pictures/maya.jpg";
import AvaPicture from "../assets/officer-pictures/ava.jpg";
import "../styles/OfficerBrickStyles.css";
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

      <h1 style= {{fontFamily: "Times New Roman"}}>Our Officers</h1>


      <div className="bg-[#f6f2ea] w-3/4 max-w-5xl shadow-sm officer-grid">    
        <OfficerBrick
          officerName="Maia E."
          officerTitle="Resources and Education Co-Editor"
          officerEmail="mairoseas@gmail.com"
          pictureLink={MayaPicture}
        />
        <OfficerBrick
          officerName="Sahasra Pothula"
          officerTitle="Outreach Coordinator"
          officerEmail="sahasrapothula@gmail.com"
        />
        <OfficerBrick
          officerName="Anya Prabhakar"
          officerTitle="Editor In Chief"
        />
        <OfficerBrick
          officerTitle="Website Designer | Social Media Manager"
          officerName="Reagan Spurlock"
          officerLinkedIn="https://www.linkedin.com/in/reagan-spurlock/"
          officerYoutube="https://www.youtube.com/@Robotica-Tech"
          officerEmail="07spree@gmail.com"
          pictureLink={ReaganPicture}
        />
        <OfficerBrick
          officerName="Ava Szajnuk"
          officerTitle="Action and Advocacy Section Editor"
          officerLinkedIn="https://www.linkedin.com/in/ava-szajnuk-b22038387?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          officerEmail="avaszajnuk@gmail.com"
          pictureLink={AvaPicture}
        />
        <OfficerBrick
          officerName="Sri Vatsa Vuddanti"
          officerTitle="Website Designer"
        />

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
