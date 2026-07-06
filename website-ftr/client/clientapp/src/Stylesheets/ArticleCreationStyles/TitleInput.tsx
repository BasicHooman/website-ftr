interface TitleInputProps {
    className?: string;
    text?: string;
    onChangeCool: React.ChangeEventHandler<HTMLInputElement>;
    placeholderText?: string;
}


const TitleInput = ({text = "", onChangeCool, className, placeholderText}: TitleInputProps) => {

    return(
        <div className = "">
            <input
                type="text"
                placeholder={placeholderText}
                value={text}
                onChange={onChangeCool}
                className={`write d-flex justify-content-center align-items-center border border-black ${className}`}
            />
        </div>
    )
}

export default TitleInput;