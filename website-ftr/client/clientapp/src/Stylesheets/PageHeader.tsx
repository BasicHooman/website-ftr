interface PageHeaderProps {
    className?: string;
    headerText: string;
}


const PageHeader : React.FC<PageHeaderProps> = ({className, headerText}) => {
    return (
        <>
            <div className={`bg-[#d6c7a0] text-gray-800 w-full mb-4 shadow-sm text-center  ${className}`}>
                <h1 className={"items-center justify-center"}>{headerText}</h1>
            </div>
        </>
    );
};

export default PageHeader;