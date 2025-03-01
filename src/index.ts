import { readFileSync } from 'fs';
import { extname } from 'path';
import { SpecSchema, type Spec } from './schema';

export class SpecScript {
  // Validate a spec file
  validateSpec(filePath: string): { valid: boolean; errors?: string[] } {
    if (extname(filePath) !== '.spec') {
      return { valid: false, errors: ['File must have .spec extension'] };
    }

    const content = readFileSync(filePath, 'utf-8');
    const result = SpecSchema.safeParse(this.parseSpec(content));
    
    if (!result.success) {
      return {
        valid: false,
        errors: result.error.errors.map(e => e.message)
      };
    }

    return { valid: true };
  }

  // Parse a spec file into structured data
  parseSpec(content: string): Spec {
    // Basic parser that converts spec format to object
    // This would need to be more robust in practice
    const lines = content.split('\n');
    // ... parsing logic ...
    return {
      type: 'Type',
      name: 'Example',
      properties: {}
    };
  }
} 