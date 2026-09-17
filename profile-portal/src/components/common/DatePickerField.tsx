import React from 'react';

interface DatePickerFieldProps {
  id: string;
  label: string;
  value: string; // Expected format: YYYY-MM-DD
  required?: boolean;
  disabled?: boolean;
  minAge?: number;
  maxAge?: number;
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, errorMsg?: string) => void;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  id,
  label,
  value,
  required = false,
  disabled = false,
  minAge = 18,
  maxAge = 120,
  error,
  helperText = 'Format: YYYY-MM-DD (Minimum age requirement: 18 years)',
  onChange,
  onValidationChange,
}) => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];
  const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    onChange(selectedDate);

    if (onValidationChange) {
      if (required && !selectedDate) {
        onValidationChange(false, 'Date of birth is required.');
        return;
      }

      if (selectedDate) {
        const dateObj = new Date(selectedDate);
        if (isNaN(dateObj.getTime())) {
          onValidationChange(false, 'Invalid date format. Use YYYY-MM-DD.');
          return;
        }

        if (selectedDate > maxDate) {
          onValidationChange(false, `Must be at least ${minAge} years old to register.`);
          return;
        }

        if (selectedDate < minDate) {
          onValidationChange(false, 'Please enter a valid realistic birth year.');
          return;
        }
      }

      onValidationChange(true);
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {label} {required && <span style={{ color: '#f43f5e' }}>*</span>}
      </label>
      <div className="input-group">
        <span
          className="input-group-text"
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderColor: error ? '#ef4444' : 'rgba(255, 255, 255, 0.12)',
            color: '#94a3b8',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </span>
        <input
          id={id}
          type="date"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          value={value || ''}
          max={maxDate}
          min={minDate}
          required={required}
          disabled={disabled}
          onChange={handleDateChange}
          style={{ colorScheme: 'dark' }}
        />
      </div>
      {error ? (
        <div className="invalid-feedback d-block mt-1" style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</div>
      ) : helperText ? (
        <small className="form-text mt-1 d-block" style={{ color: '#64748b' }}>{helperText}</small>
      ) : null}
    </div>
  );
};

