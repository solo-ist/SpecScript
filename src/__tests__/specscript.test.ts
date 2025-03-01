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
}); 