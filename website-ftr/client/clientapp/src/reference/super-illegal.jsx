import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTimezone } from './timezoneContext';
import { CoolButton, BottomHeader, TopHeader, InputText, Dropdown } from '../tailwind-styles/defaultStyles.jsx';
import ussLogo from '../assets/uss-logo.png';
import medlineLogo from "../assets/medline-logo.png";
import debugLogo from "../assets/hmi-debug-screen.png";
import TimezoneDisplay from './TimezoneDisplay';

function DebugScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [, setTimezone] = useTimezone();
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');

  const [cameraIp, setCameraIp] = useState('169.254.239.214');
  const [ curFTP, setFTP ] = useState('21');
  const [ curHTTPPort, setHTTPPort ] = useState('80');
  const [ curJob, setJob ] = useState("NewJobBackup.jobx");
  // Reagan Spurlock
  const [dbHost, setDBHost] = useState("localhost");
  const [dbName, setDBName] = useState("medlineHMI");
  const [dbUser, setDBUser] = useState("medline_hmi_user");
  const [dbPassword, setDBPassword] = useState("password");

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
  ];

  const cognexJobs = [
    { value: 'NewJobBackup.jobx', label: 'NewJobBackup.jobx' },
    { value: 'Fake_J*b.jobx', label: 'Fake_J*b.jobx' },
  ];


  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const handleApply = () => {
    console.log("Applying timezone:", selectedTimezone);
    setTimezone(selectedTimezone);
  };

  const handleCameraIpChange = (event) =>{
    setCameraIp(event.target.value);
  };

  const handleFTPChange = (event) => {
    setFTP(event.target.value);
  };

  const handleHTTPPortChange = (event) => {
    setHTTPPort(event.target.value);
  };

  const handleJobChange = (event) => {
    setJob(event.target.value);
  };


  const handleDBHostChange = (event) => {
    setDBHost(event.target.value);
  };

  const handleDBNameChange = (event) => {
    setDBName(event.target.value);
  };

  const handleDBUserChange = (event) => {
    setDBUser(event.target.value);
  };

  const handleDBPasswordChange = (event) => {
    setDBPassword(event.target.value);
  };

  const handleHMIButtonPressed = (event) =>{
    navigate('/hmi');
  }
  const handleMainMenuButtonPressed = (event) =>{
    navigate('/');
  }

  const handleFullScreenButtonPressed = () =>{
      if(!document.fullscreenElement){
          document.documentElement.requestFullscreen().catch(err => {
              console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
      } 
      else{
          document.exitFullscreen();
      }
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen overflow-y-auto">
          <title>Debug Menu</title>
          <TopHeader>
            <img src={ussLogo} alt = "uss logo" className="h-16"></img>
            <img src = {debugLogo} alt = "debugLogo" className="h-40"></img>
            <img src={medlineLogo} alt = "medline logo" className="h-16"></img>
          </TopHeader>
          <BottomHeader>
            <div className="flex items-center space-x-4">
              <CoolButton
                textFormat="text-[#545454]"
                labelText="To HMI"
                onClick={handleHMIButtonPressed}
                buttonFormat = "bg-[#d9d9d9] border-[#a6a6a6] h-10 w-30"
              />
              <CoolButton
                textFormat="text-[#545454]"
                labelText="To Main Menu"
                onClick={handleMainMenuButtonPressed}
                buttonFormat = "bg-[#d9d9d9] border-[#a6a6a6] h-10 w-30"
              />
            </div>
            <div className="flex items-center space-x-2">
              <CoolButton
                  textFormat = "text-[#545454]"
                  labelText="FULL SCREEN"
                  onClick = {handleFullScreenButtonPressed}
                  buttonFormat="bg-[#d9d9d9] border-[#a6a6a6] h-10 w-30"
              />
            </div>
          </BottomHeader>
      <div className="w-2/5 flex flex-col items-center justify-center bg-[#51819f] shadow-md">
          <p className = "font-orbitron font-extrabold mb-2 text-2xl text-[#000000]">FRONTEND ALTERATIONS: HMI SETTINGS</p>
          <div className="p-4 flex flex-col items-center min-h-screen">
              <p className="text-lg font-obitron text-black">Timezone Select</p>
              <select onChange={handleTimezoneChange} value={selectedTimezone} className="p-2 border rounded">
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            
            {/* Add the apply feature into the handleTimezoneChange (or as a seperate application entirely)*/}

            <p className = "font-orbitron font-extrabold mb-2 text-2xl text-[#000000]">BACKEND ALTERATIONS: CAMERA CONNECTION</p>

            <InputText
                labelText = "Camera IP: "
                textFormat ="text-lg font-orbitron"
                value={cameraIp}
                onChange={handleCameraIpChange}
                placeholder="Enter camera IP address"
                className = "w-30 h-10"
            />

            <InputText
                labelText= "FTP Port: "
                textFormat ="text-lg font-orbitron"
                value={curFTP}
                onChange= {handleFTPChange}
                placeholder = "Enter FTP Port"
                className = "w-45 h-10"
            />

            <InputText
                labelText = "HTTP Port: "
              textFormat ="text-lg font-orbitron "
                value = {curHTTPPort}
                onChange = {handleHTTPPortChange}
                placeholder = "Enter HTTP Port"
                className = "w-30 h-10"
            />

            <p className = "font-orbitron font-extrabold mb-2 text-2xl text-[#000000]">BACKEND ALTERATIONS: DATABASE CONNECTION</p>

            <InputText
              labelText = "Database Host: "
              textFormat ="text-lg font-orbitron"
              value = {dbHost}
              onChange = {handleDBHostChange}
              placeholder = "Enter Database Host"
              className = "w-30 h-10"
            />

            <InputText
              labelText = "Database Name: "
              textFormat ="text-lg font-orbitron"
              value = {dbName}
              onChange = {handleDBNameChange}
              placeholder = "Enter Database Name"
              className = "w-30 h-10"
            />

            <InputText
              labelText = "Database User: "
              textFormat ="text-lg font-orbitron"
              value = {dbUser}
              onChange = {handleDBUserChange}
              placeholder = "Enter Database User"
              className = "w-30 h-10"
            />

            
            <InputText
              labelText = "Database Password: "
              textFormat ="text-lg font-orbitron"
              value = {dbPassword}
              onChange = {handleDBPasswordChange}
              placeholder = "Enter Database Password"
              className = "w-30 h-10"
            />

            <p className = "font-orbitron font-extrabold mb-2 text-2xl text-[#000000]">BACKEND ALTERATIONS: JOB SELECTION</p>

            <p className="text-lg font-orbitron text-black">Job Selection: </p>
            
            <select onChange={handleJobChange} value={curJob} className="p-2 border rounded">
              {cognexJobs.map((cj) => (
                <option key={cj.value} value={cj.value}>
                  {cj.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

    </>
  );
}

export default DebugScreen;