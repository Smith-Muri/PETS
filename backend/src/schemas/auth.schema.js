/**
 * Zod Validation Schemas
 * Type-safe input validation
 */

const { z } = require('zod');

/**
 * AUTH SCHEMAS
 */

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Password mínimo 6 caracteres'),
  name: z.string().min(2, 'Nombre mínimo 2 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Password requerido'),
});

/**
 * PET SCHEMAS
 */

const createPetSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  funFacts: z.string().min(1, 'Fun facts requerido'),
});

const updatePetSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  funFacts: z.string().min(1, 'Fun facts requerido'),
  enabled: z.boolean().optional(),
});

const togglePetSchema = z.object({
  enabled: z.boolean(),
});

/**
 * LIKES SCHEMAS
 */

const createLikeSchema = z.object({
  petId: z.string().uuid('petId debe ser UUID válido'),
});

/**
 * Helper para validar input
 * @returns datos validados o throw ZodError
 */
function validate(schema, data) {
  return schema.parse(data);
}

module.exports = {
  registerSchema,
  loginSchema,
  createPetSchema,
  updatePetSchema,
  togglePetSchema,
  createLikeSchema,
  validate,
};
