import OfficerBrick from "../Stylesheets/OfficerBrick";
import PageHeader from "../Stylesheets/PageHeader";
import reagan_picture from "../assets/officer-pictures/rms.jpeg";
import ava from "../assets/officer-pictures/ava.jpg";
// please add saanvi
//import saanvi from "../assets/officer-pictures/saanvi.jpg";
import maia from "../assets/officer-pictures/maya.jpg"
import type React from 'react';

const OfficerPage : React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <title>Our Officers</title>
            
            <PageHeader
                headerText={"Our Officers"}
            />

            <div className={`bg-[#A79877FF] w-3/4 shadow-sm items-center flex flex-wrap justify-center`}>  

                <OfficerBrick
                    officerTitle= {"Action and Advocacy Editor"}
                    officerName = {"Ava"}
                    pictureLink={ava}
                />

                <OfficerBrick
                    officerTitle={"Resources and Education Editor"}
                    officerName={"Maia E."}
                    officerEmail={"mairoseas@gmail.com"}
                    pictureLink={maia}
                />   

                <OfficerBrick
                    officerTitle={"Outreach Coordinator"}
                    officerName={"Sahasra Pothula"}
                    officerEmail={"sahasrapothula@gmail.com"}
                />                
                <OfficerBrick
                    officerTitle = {"President and Founder"}
                    officerName={"Anya Prabhakar"}

                />
                <OfficerBrick 
                    officerTitle={"Website Developer"} 
                    officerName={"Reagan Spurlock"} 
                    pictureLink={reagan_picture}
                    officerLinkedIn = {"https://www.linkedin.com/in/reagan-spurlock/"}
                    officerEmail = {"universityrms@gmail.com"}
                />

                <OfficerBrick
                    officerTitle = {"Website Developer"}
                    officerName={"Sri Vatsa"}
                />
            </div>      
        </div>
    )
};

export default OfficerPage;