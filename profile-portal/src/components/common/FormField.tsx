import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  onChange,
  onBlur,
}) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {required && <span style={{ color: '#f43f5e' }}>*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="off"
      />
      {error ? (
        <div className="invalid-feedback d-block mt-1" style={{ color: '#f87171', fontSize: '0.8rem' }}>
          {error}
        </div>
      ) : helperText ? (
        <small className="form-text mt-1 d-block" style={{ color: '#64748b' }}>
          {helperText}
        </small>
      ) : null}
    </div>
  );
};

