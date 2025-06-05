import { isValidEmail, isValidDateFormat } from '../../../app/utils/validation';
import { describe } from '@jest/globals';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@example.co.uk',
        'user123@subdomain.domain.org',
        'user-name@example.io'
      ];
      
      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });
    
    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        'user@domain',
        'user@.com',
        '@domain.com',
        'user@domain..com',
        'user name@domain.com',
        'user@domain.c',
        'user@-domain.com',
        'user@domain-.com'
      ];
      
      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
    
    it('should return false for empty strings', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });
  
  describe('isValidDateFormat', () => {
    it('should return true for valid date strings in YYYY-MM-DD format', () => {
      const validDates = [
        '2023-01-01',
        '2000-12-31',
        '1990-02-28'
      ];
      
      validDates.forEach(date => {
        expect(isValidDateFormat(date)).toBe(true);
      });
    });
    
    it('should return false for invalid date strings', () => {
      const invalidDates = [
        '01/01/2023', 
        '2023/01/01', 
        '2023-13-01',
        '2023-01-32',
        '2023-02-30',
        '20230101', 
        'not-a-date'
      ];
      
      invalidDates.forEach(date => {
        expect(isValidDateFormat(date)).toBe(false);
      });
    });
    
    it('should return false for empty strings', () => {
      expect(isValidDateFormat('')).toBe(false);
    });
  });
});