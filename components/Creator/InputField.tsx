import React from "react";
import PropTypes from "prop-types";

interface InputFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError: boolean;
  errorMsg: string;
  emptyInputs: string[];
  styles?: any;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  placeholder,
  type,
  value,
  onChange,
  isError,
  errorMsg,
  emptyInputs,
  styles,
}) => {
  const inputClasses = isError
    ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
    : "w-full py-2 pl-2 mb-4 rounded-lg";

  return (
    <div>
      <label htmlFor={id} className={styles.title}>
        <span className="your-label-text">{label}</span>
        <span className="text-red">*</span>
      </label>
      <input
        placeholder={placeholder}
        type={type}
        autoComplete="off"
        id={id}
        value={value || ""}
        className={
          emptyInputs.includes(id)
            ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
            : "w-full py-2 pl-2 mb-4 border rounded-lg border-dark3 block"
        }
        onChange={onChange}
      />

      {isError && (
        <p className="mb-2 ml-3 -mt-1 text-xs text-red" key={`${id}-error`}>
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default InputField;
