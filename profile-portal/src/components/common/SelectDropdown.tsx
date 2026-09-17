import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  id,
  label,
  value,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error,
  onChange,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {required && <span style={{ color: '#f43f5e' }}>*</span>}
      </label>
      <select
        id={id}
        name={id}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
      >
        <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#0f172a', color: '#f8fafc' }}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="invalid-feedback d-block mt-1" style={{ color: '#f87171', fontSize: '0.8rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

