export default function useFormValidation(rules = {}) {
  const validate = useCallback((data = {}) => {
    const errors = {};

    Object.keys(rules).forEach((field) => {
      const rule = rules[field] || {};
      const value = data[field];

      if (rule.required) {
        const empty = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
        if (empty) {
          errors[field] = rule.message || 'Campo requerido';
          return;
        }
      }

      if (typeof rule.validate === 'function') {
        const res = rule.validate(value, data);
        if (res !== true) {
          errors[field] = typeof res === 'string' ? res : (rule.message || 'Valor inválido');
        }
      }
    });

    return { valid: Object.keys(errors).length === 0, errors };
  }, [rules]);

  return { validate };
}
