

interface FTRButtonProps {
    buttonText: string;
    onClick: () => void;
    disabled?: boolean;
};

const FTRButton = ({buttonText, onClick, disabled} : FTRButtonProps) => {
    return (
        <div>
            <button onClick={onClick} disabled={disabled} className ="front-bold border-[#FF00E6FF] rounded-lg shadow-md border-4 flex items-center justify-center">
                {buttonText}
            </button>
        </div>
    );
};

export default FTRButton;