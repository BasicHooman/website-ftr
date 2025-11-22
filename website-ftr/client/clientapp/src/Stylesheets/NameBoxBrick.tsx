interface NameBoxBrickProps {
    officerName: string;
}

const NameBoxBrick : React.FC<NameBoxBrickProps> = ({officerName}) => {
    return (
        <div className={`text-center mb-4`}>
            <p className="font-bold bg-[#d6c7a0] p-2 rounded-md">{officerName}</p>
        </div>
    );
};

export default NameBoxBrick;