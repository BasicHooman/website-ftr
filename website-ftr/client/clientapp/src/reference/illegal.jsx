import React from 'react';
import ussLogo from '../assets/uss-logo.png';
import medlineLogo from "../assets/medline-logo.png";

export const ImageButton = ({ src, alt, onClick, className }) => {
    return (
        <button onClick={onClick} className={`p-0 bg-transparent border-none focus:outline-none ${className}`}>
            <img src={src} alt={alt} className="w-full h-full object-contain" />
        </button>
    );
};

export const TopHeader = ({className}) => {
    return (
        <nav
            className = {`w-full h-[100px] bg-[#DCE3E5] text-white flex items-center justify-between px-6 shadow-md sticky top-0 z-50 ${className}`}
        >
            <img src={ussLogo} alt="uss logo" className="h-20" />
            <img src = {medlineLogo} alt="medline logo" className="h-20" />
        </nav>
    );
};
// Reagan Spurlock
export const BottomHeader = ({ children, className }) => {
    return (
        <nav 
            className = {`w-full h-[50px] bg-[#C4CED4] text-white flex items-center justify-between px-6 shadow-lg sticky top-[100px] z-50 ${className}`}
        >
            {children}
        </nav>
    );
};

export const Dropdown = ({ textFormat, labelText, options, className, onChange, selectedValue }) => {
    return (
        <div className={`inline-flex items-center rounded-xl ${className}`}>
            <div className={`flex`}>
                <select
                    value = {selectedValue}
                    onChange = {onChange}
                    className={`
                        p-1 rounded-xl
                        border-4 border-solid 
                        ${className}
                    `}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


export const CoolButton = ({ textFormat, labelText, onClick, buttonFormat }) => {
    return (
        <button onClick = {onClick} className = {`font-bold rounded-lg shadow-md border-4 flex items-center justify-center ${buttonFormat}`}>
            <p className={`${textFormat}`}>{labelText}</p>
        </button>
    );
};

export const CameraImageLive = ({ src, alt, borderColorClass, className }) => {
    return (
        <div className={`border-8 ${borderColorClass} ${className}`}>
            <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
    );
};

export const DiagnosticDisplay = ({ resetFunction, headerFormat, data, className, headerText1, headerText2 }) => {
    return (
        <>
            <div className={`bg-[#DCE3E5] p-8 rounded-md shadow-lg ${className}`}>
                <h2 className={`text-xl text-gray-700 font-bold font-orbitron mb-4 ${headerFormat}`}>{headerText1}</h2>
                <ul className="text-lg">
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key} className="mb-1 text-gray-500">
                            <span className="font-medium text-gray-500 ">{key}:</span> {String(value)}
                        </li>
                    ))}
                </ul>
                <CoolButton
                    textFormat="font-orbitron font-bold text-[#004d7f] fontSize=8px"
                    labelText="Reset"
                    onClick={resetFunction}
                    buttonFormat="bg-[#c4ced4] border-[#004d7f] h-8 w-20"
                />
            </div>
        </>
    );
};


export const InputText = ({ labelText, textFormat, className, value, onChange, placeholder }) => {
    return (
        <>
            <div className={`text-black text-md ${textFormat}`}>
                <p>{labelText}</p>
            </div>

            <div className={`${className}`}>
                <input 
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className = "p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>
        </>
    );
};