import React from "react";
import PropTypes from "prop-types";
import { AiOutlineExclamation } from "react-icons/ai";

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
  tooltip?: string;
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
  tooltip,
}) => {
  const inputClasses = isError
    ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
    : "w-full py-2 pl-2 mb-4 rounded-lg";

  return (
    <div className="">
      <label htmlFor={id} className={styles.title}>
        <div className="relative flex items-center gap-2">
          {tooltip && (
            <div className="pb-2 -mb-2 transition-all group w-fit">
              <span className="bg-yellow rounded-full block p-0.5 text-xs text-secondary3">
                <AiOutlineExclamation />
              </span>
              <p className="absolute z-10 hidden px-4 py-2 text-sm text-gray-500 transition-all bg-white border rounded-md font-base w-fit group-hover:block top-6">
                {tooltip}
              </p>
            </div>
          )}

          <span className="your-label-text">{label}</span>
          <span className="text-red">*</span>
        </div>
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
