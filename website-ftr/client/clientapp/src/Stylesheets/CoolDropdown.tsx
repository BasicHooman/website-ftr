import type { ChangeEvent } from "react";
import type React from "react";

interface CoolDropdownProps {
  textFormat?: string;
  labelText?: string;
  options: Array<{ value: string | number; label: string; }>;
  className?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedValue?: string;
  dropdownLabelTitle: string;
  style?: React.CSSProperties;
}

const CoolDropdown = ({ options, className, onChange, selectedValue, dropdownLabelTitle, style }: CoolDropdownProps) => {
  return (
    <div className={`
      inline-flex
      items-center
      border-[#d6c7a0]
      rounded-xl
      bg-[#f5f1e9]
      ${className}
    `}>
      <select
        value={selectedValue}
        onChange={onChange}
        className={`
          p-1 pr-8
          justify-center
          bg-transparent
          ${className}
        `}
        style={{
          // Add this to explicitly remove the native border
          border: '0px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          fontFamily: "Times New Roman",
          ...style
        }}
      >
        <option value="" disabled hidden>{dropdownLabelTitle}</option>
        {options.map((option: { value: string | number; label: string; }, index: number) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default CoolDropdown;