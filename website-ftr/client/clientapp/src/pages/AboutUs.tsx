import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CopyComponent } from '../Stylesheets/mainStyles';

const AboutUs : React.FC = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await axios.get('http://localhost:5173/officers');
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
          <CopyComponent
            key={officer.id}
            officerName={officer.fullName}
            officerTitle={officer.title}
            officerDescription={officer.description}
            officerEmail={officer.email}
            officerPhone={officer.phoneNumber}
            officerLocation={officer.location}
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
