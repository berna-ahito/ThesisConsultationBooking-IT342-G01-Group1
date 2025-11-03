import PropTypes from "prop-types";
import "./FormInput.css";

const FormInput = ({
  label,
  type = "text",
  name,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint,
  className = "",
  options = [],
  children,
}) => {
  const inputId = id || name;

  return (
    <div className={`form-input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`form-input-field form-select ${error ? "error" : ""}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {Array.isArray(options) &&
            options.map((opt) => (
              <option
                key={opt.value ?? opt.label}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}

          {children}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input-field form-textarea ${error ? "error" : ""}`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`form-input-field ${error ? "error" : ""}`}
        />
      )}

      {error && <span className="form-input-error">{error}</span>}
      {hint && !error && <span className="form-input-hint">{hint}</span>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "select",
    "textarea",
  ]),
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  children: PropTypes.node,
};

export default FormInput;
