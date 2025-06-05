import { updateCustomerSchema } from '../../../app/schemas/customerSchemas';

describe('Customer Schemas', () => {
  describe('updateCustomerSchema', () => {
    it('should validate valid customer data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        birth_date: '1990-01-01'
      };
      
      const result = updateCustomerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should validate partial data (only name)', () => {
      const partialData = {
        name: 'John Doe'
      };
      
      const result = updateCustomerSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email'
      };
      
      const result = updateCustomerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const emailError = result.error.errors.find(err => 
          err.path.includes('email')
        );
        expect(emailError).toBeDefined();
        expect(emailError?.message).toBe('Formato de e-mail inválido.');
      }
    });

    it('should reject invalid birth_date format', () => {
      const invalidData = {
        birth_date: '01/01/1990' // Formato incorreto
      };
      
      const result = updateCustomerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const dateError = result.error.errors.find(err => 
          err.path.includes('birth_date')
        );
        expect(dateError).toBeDefined();
        expect(dateError?.message).toBe('Formato de data de nascimento inválido. Use YYYY-MM-DD.');
      }
    });

    it('should reject name with less than 3 characters', () => {
      const invalidData = {
        name: 'Jo'
      };
      
      const result = updateCustomerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const nameError = result.error.errors.find(err => 
          err.path.includes('name')
        );
        expect(nameError).toBeDefined();
        expect(nameError?.message).toBe('Nome deve ter pelo menos 3 caracteres.');
      }
    });

    it('should reject unknown fields', () => {
      const invalidData = {
        name: 'John Doe',
        unknown_field: 'value'
      };
      
      const result = updateCustomerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});