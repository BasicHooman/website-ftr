import {useRef, useState, useEffect} from "react";
import defaultImage from '../assets/ftr_logo_black.png';

interface OfficerBrickProps {
  pictureLink?: string;
  officerName: string;
  officerTitle: string;
  officerEmail?: string;
  officerYoutube?: string;
  officerLinkedIn?: string;
  officerInstagram?: string;
  officerTwitter?: string;
  officerFacebook?: string;
}

const OfficerBrick : React.FC<OfficerBrickProps> = ({ pictureLink, officerName, officerTitle, officerEmail, officerYoutube, officerLinkedIn, officerInstagram, officerTwitter, officerFacebook }: OfficerBrickProps) => {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [nameFontSize, setNameFontSize] = useState('1.5rem');
  const [titleFontSize, setTitleFontSize] = useState('1.rem');

  useEffect(() => {
    const adjustFontSize = (ref: React.RefObject<HTMLParagraphElement | null>, initialSize: string, setFontSize: React.Dispatch<React.SetStateAction<string>>) => {
      if (ref.current) {
        ref.current.style.fontSize = initialSize; // Reset to initial size
        let currentSize = parseFloat(initialSize);
        const containerWidth = ref.current.clientWidth;
        let textWidth = ref.current.scrollWidth;

        while (textWidth > containerWidth && currentSize > 0.5) { // Shrink down to 0.5rem
          currentSize -= 0.1; // Decrease by 0.1rem
          ref.current.style.fontSize = `${currentSize}rem`;
          textWidth = ref.current.scrollWidth;
        }
        setFontSize(`${currentSize}rem`);
      }
    };

    const handleResize = () => {
      adjustFontSize(nameRef, '1.5rem', setNameFontSize);
      adjustFontSize(titleRef, '1rem', setTitleFontSize);
    };

    handleResize(); // Adjust on initial render

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [officerName, officerTitle]);

  return (
    <div className={`bg-[#f5f1e9] p-8 w-1/6 h-[32rem] rounded-md shadow-md justify-center outline outline-4 outline-round-md outline-offset-2 outline-[#d6c7a0]`} style={{ transform: 'scale(0.9)', fontFamily: "Times New Roman" }}>
      <div className="text-center mb-4">
        <p ref={nameRef} className="font-bold bg-[#d6c7a0] p-2 rounded-md" style={{ fontSize: nameFontSize }}>{officerName}</p>
      </div>
      <div className={`text-center mb-4`}>
        <p ref={titleRef} className="bg-[#d6c7a0] p-2 rounded-md" style={{ fontSize: titleFontSize }}>{officerTitle}</p>
      </div>
      <div className="bg-[#d6c7a0] rounded-md mb-4 flex justify-center items-center">
        <img src={pictureLink ? pictureLink : defaultImage} alt="officerImage" className="w-7/8 p-4" />
      </div>
      {(officerEmail || officerYoutube || officerLinkedIn || officerInstagram || officerTwitter || officerFacebook) && (
        <div className="socials-box text-center bg-[#d6c7a0] p-2 rounded-md mb-4">
          <p className="p-2 rounded-md mb-2" style={{ fontSize: '1rem' }}>Contacts</p>
          <div className="flex flex-wrap">
            {officerEmail && <p className="w-full" style={{ fontSize: '0.5rem' }}>Email: <a target="_blank" rel="noopener noreferrer">{officerEmail}</a></p>}
            {officerYoutube && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerYoutube} target="_blank" rel="noopener noreferrer">YouTube</a></p>}
            {officerLinkedIn && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerLinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>}
            {officerInstagram && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerInstagram} target="_blank" rel="noopener noreferrer">Instagram</a></p>}
            {officerTwitter && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerTwitter} target="_blank" rel="noopener noreferrer">X (Twitter)</a></p>}
            {officerFacebook && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerFacebook} target="_blank" rel="noopener noreferrer">Facebook</a></p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerBrick;