import { SpecScript } from '../index';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

describe('SpecScript', () => {
  const testDir = join(__dirname, 'test-specs');
  
  beforeAll(() => {
    mkdirSync(testDir, { recursive: true });
  });

  it('validates a valid spec file', () => {
    const validSpec = `
Type: User
  Properties:
    id: required unique identifier
    email: required email
    name: required text
    role: one of [admin, user, guest]
    tags: many of text
`;
    
    const specPath = join(testDir, 'valid.spec');
    writeFileSync(specPath, validSpec);

    const spec = new SpecScript();
    const result = spec.validateSpec(specPath);
    
    expect(result.valid).toBe(true);
  });

  it('rejects an invalid spec file', () => {
    const invalidSpec = `
Invalid: User
  NotProperties:
    id: something wrong
`;
    
    const specPath = join(testDir, 'invalid.spec');
    writeFileSync(specPath, invalidSpec);

    const spec = new SpecScript();
    const result = spec.validateSpec(specPath);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('rejects a file with invalid modifier', () => {
    const invalidModifierSpec = `
Type: Product
  Properties:
    price: invalid number
`;
    
    const specPath = join(testDir, 'invalid-modifier.spec');
    writeFileSync(specPath, invalidModifierSpec);

    const spec = new SpecScript();
    const result = spec.validateSpec(specPath);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid modifier in: invalid number');
  });

  it('handles multi-word modifiers correctly', () => {
    const multiWordSpec = `
Type: Category
  Properties:
    type: one of [book, movie, game]
    tags: many of string
`;
    
    const specPath = join(testDir, 'multi-word.spec');
    writeFileSync(specPath, multiWordSpec);

    const spec = new SpecScript();
    const result = spec.validateSpec(specPath);
    
    expect(result.valid).toBe(true);
  });
}); 