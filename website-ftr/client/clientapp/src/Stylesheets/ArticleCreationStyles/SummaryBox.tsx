import { useEffect, useState } from "react";

interface SummaryBoxProps {
    text?: string;
    onChange?: (value: string) => void;
    className?: string;
    placeholderText: string;
    numRows: number;
}


{/* thisis good but the best thing we could do rn is perhaps make this textbox expandable. Also change the width to match the width of the other
    input for the rest of the "writing the article" part*/}
const SummaryBox = ({ text: initialText = "", onChange, placeholderText, className = "", numRows }: SummaryBoxProps) => {
    const [text, setText] = useState(initialText);

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setText(value);
        onChange?.(value);
    };

    return (
        <div className="containerr">
            <textarea
                value={text}
                onChange={handleChange}
                rows={numRows}
                placeholder={placeholderText}
                className={`summary thumbnail ${className}`}
                style={{ resize: "none", overflowY: "auto", height: "auto", fontFamily: "Times New Roman" }}
            />
        </div>
    );
};

export default SummaryBox;