import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AboutUs = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/officers');
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
      <h1>About Us</h1>
      <div className="officer-container">
        {officers.map((officer) => (
          <div key={officer.id} className="officer-card">
            {officer.photo && (
              <img
                src={`data:image/jpeg;base64,${officer.photo}`}
                alt={officer.fullName}
                style={{ width: "300px", height: "300px", objectFit: "cover", marginBottom: "10px" }}
              />
            )}
            <h2>{officer.fullName}</h2>
            <h3>{officer.title}</h3>
            <p>{officer.description}</p>
            {officer.email && <p>Email: {officer.email}</p>}
            {officer.phoneNumber && <p>Phone: {officer.phoneNumber}</p>}
            {officer.location && <p>Location: {officer.location}</p>}
            {officer.youtube && <p>YouTube: <a href={officer.youtube} target="_blank" rel="noopener noreferrer">{officer.youtube}</a></p>}
            {officer.linkedin && <p>LinkedIn: <a href={officer.linkedin} target="_blank" rel="noopener noreferrer">{officer.linkedin}</a></p>}
            {officer.instagram && <p>Instagram: <a href={officer.instagram} target="_blank" rel="noopener noreferrer">{officer.instagram}</a></p>}
            {officer.x_social && <p>X (Twitter): <a href={officer.x_social} target="_blank" rel="noopener noreferrer">{officer.x_social}</a></p>}
            {officer.facebook && <p>Facebook: <a href={officer.facebook} target="_blank" rel="noopener noreferrer">{officer.facebook}</a></p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
