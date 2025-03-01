import { readFileSync } from 'fs';
import { extname } from 'path';
import { SpecSchema, type Spec, RESERVED_WORDS, MODIFIERS } from './schema';

export class SpecScript {
  // Validate a spec file
  validateSpec(filePath: string): { valid: boolean; errors?: string[] } {
    if (extname(filePath) !== '.spec') {
      return { valid: false, errors: ['File must have .spec extension'] };
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const parsed = this.parseSpec(content);
      const result = SpecSchema.safeParse(parsed);
      
      if (!result.success) {
        return {
          valid: false,
          errors: result.error.errors.map(e => e.message)
        };
      }

      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      };
    }
  }

  // Parse a spec file into structured data
  parseSpec(content: string): Spec {
    const lines = content.trim().split('\n');
    const firstLine = lines[0].trim();
    
    // Parse first line which should be "Type: Name"
    const typeMatch = firstLine.match(/^(\w+):\s*(\w+)$/);
    if (!typeMatch) {
      throw new Error('Invalid type declaration');
    }
    
    const [, type, name] = typeMatch;
    if (!RESERVED_WORDS.includes(type as any)) {
      throw new Error(`Invalid type: ${type}`);
    }

    // Parse properties
    const properties: Record<string, { 
      type: string; 
      modifiers?: typeof MODIFIERS[number][] 
    }> = {};
    let inProperties = false;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line === 'Properties:') {
        inProperties = true;
        continue;
      }

      if (inProperties) {
        const propMatch = line.match(/^\s*(\w+):\s*(.+)$/);
        if (!propMatch) {
          throw new Error(`Invalid property declaration: ${line}`);
        }

        const [, propName, propDef] = propMatch;
        
        // Find the modifier by trying to match the longest possible modifier first
        let foundModifier: typeof MODIFIERS[number] | undefined;
        let remainingDef = propDef;

        // Sort modifiers by length (longest first) to match "one of" before "one"
        const sortedModifiers = [...MODIFIERS].sort((a, b) => b.length - a.length);
        
        for (const mod of sortedModifiers) {
          if (propDef.startsWith(mod)) {
            foundModifier = mod;
            remainingDef = propDef.slice(mod.length).trim();
            break;
          }
        }

        if (!foundModifier) {
          throw new Error(`Invalid modifier in: ${propDef}`);
        }

        properties[propName] = {
          type: remainingDef,
          modifiers: [foundModifier]
        };
      }
    }

    return {
      type: type as typeof RESERVED_WORDS[number],
      name,
      properties
    };
  }
} 