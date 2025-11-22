interface CustomImageFrame {
  innerWidthRatio?: string;
  innerHeightRatio?: string;
  imageSource?: string;
}

const CustomImageFrame : React.FC<CustomImageFrame> = ({innerWidthRatio, innerHeightRatio, imageSource}) => {
  return (
    <>
      <div className={`w-${innerWidthRatio} h-${innerHeightRatio} bg-[#000000] outline-[#E600FFFF]`}>
        <img className={`w-full h-full`} src={imageSource}></img>
      </div>
    </>
  );
};

export default CustomImageFrame;