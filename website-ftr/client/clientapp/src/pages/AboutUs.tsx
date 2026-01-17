
const AboutUs: React.FC = () =>{
  return (
    <div>
      <title>About Us</title>

      <div className="flex flex-col items-center justify-center" style={{fontFamily: "Times New Roman"}}>
        <div className="w-7/8 bg-[#f5f1e9] 6rm">
          <h1 style={{paddingLeft: "2rem"}}>Leaders in youth advocacy fighting for change, one article at a time.</h1>

          <div>
            <p>Created in 2025, For The Record is an organization of student writers in secondary and post-secondary schools. As a global force, we have writers and editors from many different countries. We use the internet to unite the universally repressed youth voice.</p>
            <p>The young will inherit the world, yet we are given little say of how lawmakers and businessmen treat it. We are using For The Record to speak out again injustice and find empowerment. </p>
            <p>Everything you see on this here is 100% student made, including even the artchitecture of this website! If you are interested in learning more, joining our team, or supporting our journey, feel free to get in contact with any of our officers, or use the contact information below.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
