interface FTRInputSmallProps {
    placeholder?: string;
    inputValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FTRInputSmall = ({placeholder, inputValue, onChange}: FTRInputSmallProps) => {

    return(
        <div style={{fontFamily: "Times New Roman"}}>
            <input 
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={onChange}
                className = ""
            />
        </div>
    );
};

export default FTRInputSmall;