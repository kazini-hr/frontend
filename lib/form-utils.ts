// lib/form-utils.ts
import { useState, useCallback } from 'react';

// Type definitions for validation rules
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  email?: boolean;
  url?: boolean;
  number?: boolean;
  integer?: boolean;
  positive?: boolean;
  custom?: (value: any) => string | null;
  match?: string; // Field name to match against
  dependencies?: string[]; // Fields that affect this validation
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormTouched {
  [key: string]: boolean;
}

// Validation utilities
export const validationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Phone number validation (Kenyan format)
  isValidKenyanPhone: (phone: string): boolean => {
    const phoneRegex = /^(?:\+254|254|0)?([17][0-9]{8})$/;
    return phoneRegex.test(phone);
  },

  // Kenya PIN validation
  isValidKraPin: (pin: string): boolean => {
    const kraRegex = /^[A-Z]\d{9}[A-Z]$/;
    return kraRegex.test(pin);
  },

  // Company PIN validation
  isValidCompanyPin: (pin: string): boolean => {
    const companyRegex = /^P\d{9}[A-Z]$/;
    return companyRegex.test(pin);
  },

  // ID number validation
  isValidIdNumber: (id: string): boolean => {
    const idRegex = /^\d{7,8}$/;
    return idRegex.test(id);
  },

  // Postal code validation (Kenyan)
  isValidPostalCode: (code: string): boolean => {
    const postalRegex = /^\d{5}$/;
    return postalRegex.test(code);
  },

  // Password strength validation
  getPasswordStrength: (password: string): { score: number; feedback: string[] } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Include lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Include uppercase letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Include numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('Include special characters');

    return { score, feedback };
  },

  // Format currency for display
  formatCurrency: (amount: number, currency = 'KES'): string => {
    return `${currency} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
  },

  // Clean phone number to standard format
  cleanPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Convert to international format
    if (cleaned.startsWith('0')) {
      return `254${cleaned.slice(1)}`;
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return `254${cleaned}`;
    }
    return cleaned;
  }
};

// Main form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules = {},
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    resetOnSubmit?: boolean;
  } = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const {
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false
  } = options;

  // Validate a single field
  const validateField = useCallback((name: keyof T, value: any, allValues = values): string | null => {
    const rule = rules[name as string];
    if (!rule) return null;

    // Required validation
    if (rule.required) {
      if (value === undefined || value === null || value === '') {
        return `${String(name).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
      if (Array.isArray(value) && value.length === 0) {
        return `${String(name).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    }

    // Skip other validations if value is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return null;
    }

    const stringValue = String(value);

    // Length validations
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `Must be less than ${rule.maxLength} characters`;
    }

    // Number validations
    if (rule.number || rule.integer || rule.min !== undefined || rule.max !== undefined) {
      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        return 'Must be a valid number';
      }

      if (rule.integer && !Number.isInteger(numValue)) {
        return 'Must be a whole number';
      }

      if (rule.positive && numValue <= 0) {
        return 'Must be a positive number';
      }

      if (rule.min !== undefined && numValue < rule.min) {
        return `Must be at least ${rule.min}`;
      }

      if (rule.max !== undefined && numValue > rule.max) {
        return `Must be no more than ${rule.max}`;
      }
    }

    // Email validation
    if (rule.email && !validationUtils.isValidEmail(stringValue)) {
      return 'Please enter a valid email address';
    }

    // URL validation
    if (rule.url && !validationUtils.isValidUrl(stringValue)) {
      return 'Please enter a valid URL';
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return 'Invalid format';
    }

    // Match validation (e.g., confirm password)
    if (rule.match) {
      const matchValue = allValues[rule.match];
      if (value !== matchValue) {
        return `Must match ${rule.match.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      }
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        return customError;
      }
    }

    return null;
  }, [rules, values]);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((fieldName) => {
      const error = validateField(fieldName as keyof T, values[fieldName as keyof T], values);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, values, validateField]);

  // Validate fields with dependencies
  const validateDependentFields = useCallback((changedField: keyof T) => {
    const fieldsToValidate = new Set<string>();
    
    // Add the changed field
    fieldsToValidate.add(String(changedField));
    
    // Find fields that depend on the changed field
    Object.entries(rules).forEach(([fieldName, rule]) => {
      if (rule.dependencies?.includes(String(changedField))) {
        fieldsToValidate.add(fieldName);
      }
      if (rule.match === String(changedField)) {
        fieldsToValidate.add(fieldName);
      }
    });

    // Validate all dependent fields
    const newErrors = { ...errors };
    fieldsToValidate.forEach(fieldName => {
      const error = validateField(fieldName as keyof T, values[fieldName as keyof T], values);
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
    });

    setErrors(newErrors);
  }, [rules, values, errors, validateField]);

  // Handle field value change
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing (after first touch)
    if (touched[name as string] && errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      })
    }

    // Validate on change if enabled
    if (validateOnChange || submitCount > 0) {
      setTimeout(() => validateDependentFields(name), 0);
    }
  }, [touched, errors, validateOnChange, submitCount, validateDependentFields]);

  // Handle field blur
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name as string]: true }));
    
    if (validateOnBlur) {
      const error = validateField(name, values[name], values);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors[name as string] = error;
        } else {
          delete newErrors[name as string];
        }
        return newErrors;
      });
    }
  }, [validateOnBlur, validateField, values]);

  // Set multiple values at once
  const setFieldValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((name: keyof T, error: string | null) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[name as string] = error;
      } else {
        delete newErrors[name as string];
      }
      return newErrors;
    });
  }, []);

  // Clear field error
  const clearFieldError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form to initial values
  const reset = useCallback((newInitialValues?: Partial<T>) => {
    const resetValues = newInitialValues 
      ? { ...initialValues, ...newInitialValues }
      : initialValues;
    
    setValues(resetValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (
    onSubmit: (values: T) => Promise<void> | void,
    onError?: (errors: FormErrors) => void
  ) => {
    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    const isValid = validateForm();
    
    if (!isValid) {
      setIsSubmitting(false);
      onError?.(errors);
      return false;
    }

    try {
      await onSubmit(values);
      
      if (resetOnSubmit) {
        reset();
      }
      
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, values, errors, resetOnSubmit, reset]);

  // Get field props for easy spreading
  const getFieldProps = useCallback((name: keyof T) => {
    return {
      name: String(name),
      value: values[name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(name, e.target.value),
      onBlur: () => handleBlur(name),
      error: touched[name as string] && errors[name as string],
      'aria-invalid': !!(touched[name as string] && errors[name as string]),
      'aria-describedby': errors[name as string] ? `${String(name)}-error` : undefined,
    };
  }, [values, handleChange, handleBlur, touched, errors]);

  // Check if field has error
  const hasError = useCallback((name: keyof T): boolean => {
    return !!(touched[name as string] && errors[name as string]);
  }, [touched, errors]);

  // Get field error message
  const getFieldError = useCallback((name: keyof T): string | undefined => {
    return touched[name as string] ? errors[name as string] : undefined;
  }, [touched, errors]);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;
  
  // Check if form has been touched
  const isDirty = Object.keys(touched).length > 0;

  return {
    // Form state
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    submitCount,

    // Field handlers
    handleChange,
    handleBlur,
    setFieldValues,
    setFieldError,
    clearFieldError,
    clearErrors,
    getFieldProps,
    hasError,
    getFieldError,

    // Form handlers
    validateForm,
    validateField,
    handleSubmit,
    reset,

    // Direct setters (use sparingly)
    setValues,
    setErrors,
    setTouched,
  };
}

// Utility function for creating async validation
export function createAsyncValidator<T>(
  asyncFn: (value: any, values: T) => Promise<string | null>,
  debounceMs = 300
) {
  let timeoutId: NodeJS.Timeout;
  
  return (value: any, values: T): Promise<string | null> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFn(value, values);
          resolve(result);
        } catch (error) {
          resolve('Validation error occurred');
        }
      }, debounceMs);
    });
  };
}

// Pre-built validation rules
export const commonValidationRules = {
  email: {
    required: true,
    email: true,
  },
  
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      const { score, feedback } = validationUtils.getPasswordStrength(value);
      if (score < 3) {
        return `Weak password. ${feedback.join(', ')}.`;
      }
      return null;
    },
  },
  
  confirmPassword: (passwordField = 'password') => ({
    required: true,
    match: passwordField,
  }),
  
  kenyanPhone: {
    required: true,
    custom: (value: string) => {
      if (!validationUtils.isValidKenyanPhone(value)) {
        return 'Please enter a valid Kenyan phone number';
      }
      return null;
    },
  },
  
  kraPin: {
    required: true,
    custom: (value: string) => {
      if (!validationUtils.isValidKraPin(value)) {
        return 'Please enter a valid KRA PIN (format: A123456789X)';
      }
      return null;
    },
  },
  
  companyPin: {
    required: true,
    custom: (value: string) => {
      if (!validationUtils.isValidCompanyPin(value)) {
        return 'Please enter a valid Company PIN (format: P123456789X)';
      }
      return null;
    },
  },
  
  amount: {
    required: true,
    number: true,
    positive: true,
    min: 1,
  },
  
  postalCode: {
    required: true,
    custom: (value: string) => {
      if (!validationUtils.isValidPostalCode(value)) {
        return 'Please enter a valid 5-digit postal code';
      }
      return null;
    },
  },
};

export default useFormValidation;