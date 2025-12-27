import type React from "react";

interface FTRButtonProps {
    buttonText: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;

};

const FTRButton = ({buttonText, onClick, disabled, className, style} : FTRButtonProps) => {
    return (
        <div>
            <button style={{ fontFamily: "Times New Roman", ...style}} onClick={onClick} disabled={disabled} className ={`thumbnail botton mx-2 ${className}` }>
                {buttonText}
            </button>
        </div>
    );
};

export default FTRButton;