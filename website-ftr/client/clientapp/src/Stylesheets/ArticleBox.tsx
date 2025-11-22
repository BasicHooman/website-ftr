import React from "react";
//havent quite implemented the navigation, will get to that
//import useParams from "react-router-dom";
//import useNavigate from 'react-router-dom';  
import ftrLogo from '../assets/ftr_logo_black.png';

interface ArticleBoxProps {
  articleName: string,
  authorName: string,
  articleText: string,
  articleDate: string
  subtitle?: string,
}

const ArticleBox : React.FC<ArticleBoxProps> = ({articleName, authorName, articleText, articleDate, subtitle}) => {
  return (
    // 1. UPDATED: Added 'flex flex-col items-center' to center all content horizontally.
    <div className={`bg-[#f5f1e9] outline-[#d6c7a0] outline outline-4 outline-round-md outline-offset-2 h-1/3 w-1/4 rounded-md shadow-md flex flex-col items-center`}>
      
      {/* Text content will be centered due to 'items-center' on the parent */}
      <h2 className="w-full text-left">{articleName}</h2>
      <h6 className="w-full text-left font-size: 19px">{subtitle}</h6>
      <p className="w-full text-left">By: {authorName}</p>

      <div className="flex items-center justify-center bg-[#542124] outline-[#00FF62FF] my-4 w-full">
        {/* The black box holding the image */}
        <div className={`w-1/2 h-1/3 bg-[#000000] outline-[#E600FFFF]`}>
          {/* Note: In a real app, you might need to adjust w/h for the image container */}
          <img className={`w-full h-full`} src={ftrLogo} alt="Article Feature Graphic"></img>
        </div>
      </div>
      {/* I'd like to italcize the date but i fotget how to do that */}
      <p className="w-full text-left">{articleDate} {articleText}</p>
    </div>
  );
};

export default ArticleBox;