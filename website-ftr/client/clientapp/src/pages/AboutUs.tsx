import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerBrick from '../Stylesheets/OfficerBrick';

interface Officer {
  id: number;
  fullName: string;
  title: string;
  email?: string;
  location?: string;
  youtube?: string;
  linkedin?: string;
  instagram?: string;
  x_social?: string;
  facebook?: string;
  photo?: string; // base64 string (optional)
}

const AboutUs : React.FC = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        // after development youve gotta replace this with an api endpoint to the backend
        const response = await axios.get<Officer[]>('http://localhost:5173/officers');
        setOfficers(response.data);
      } catch (error) {
        console.error('Error fetching officers:', error);
      } finally {
        setLoading(false);
      }
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
            officerName={officer.fullName}
            officerTitle={officer.title}
            officerEmail={officer.email}
            officerYoutube={officer.youtube}
            officerLinkedIn={officer.linkedin}
            officerInstagram={officer.instagram}
            officerTwitter={officer.x_social}
            officerFacebook={officer.facebook}
            pictureLink={`data:image/jpeg;base64,${officer.photo}`}
          />
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
