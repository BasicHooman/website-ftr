import React, { useState } from 'react';
import axios from 'axios';

const DebugPage: React.FC = () => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [youtube, setYoutube] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [x_social, setX_social] = useState('');
  const [facebook, setFacebook] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('bio', bio);
    if (image) {
      formData.append('image', image);
    }
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('location', location);
    formData.append('youtube', youtube);
    formData.append('linkedin', linkedin);
    formData.append('instagram', instagram);
    formData.append('x_social', x_social);
    formData.append('facebook', facebook);

    // Basic client-side validation
    if (!name || !position || !bio || !image) {
      alert('Please fill in all required fields (Name, Position, Bio, Image).');
      console.error('Validation Error: Missing required fields.');
      return;
    }

    // Log the data being sent (excluding the image file itself for brevity)
    console.log('Attempting to add officer with data:', {
      name,
      position,
      bio,
      image: image ? image.name : 'No image selected',
      email,
      phoneNumber,
      location,
      youtube,
      linkedin,
      instagram,
      x_social,
      facebook,
    });

    try {
      const response = await axios.post('/debug/add-officer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server Response:', response.data);
      alert('Officer added successfully!');
    } catch (error: unknown) {
      console.error('Error adding officer:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Server Error Data:', error.response.data);
          console.error('Server Error Status:', error.response.status); 
          console.error('Server Error Headers:', error.response.headers);
          alert(`Error adding officer: ${(error.response.data as { message?: string })?.message || 'Server responded with an error.'} Status: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('Network Error: No response received from server.', error.request);
          alert('Network Error: Could not connect to the server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request Setup Error:', error.message);
          alert(`An unexpected error occurred: ${error.message}`);
        }
      } else {
        console.error('Unexpected non-Axios error:', error);
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div>
      <h1>Debug Page - Add Officer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Position:</label>
          <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} />
        </div>
        <div>
          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label>Image:</label>
          <input type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div>
          <label>YouTube:</label>
          <input type="url" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
        </div>
        <div>
          <label>LinkedIn:</label>
          <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
        </div>
        <div>
          <label>Instagram:</label>
          <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div>
          <label>X (Twitter):</label>
          <input type="url" value={x_social} onChange={(e) => setX_social(e.target.value)} />
        </div>
        <div>
          <label>Facebook:</label>
          <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
        </div>
        <button type="submit">Add Officer</button>
      </form>
    </div>
  );
};

export default DebugPage;
