import { SpecScript } from 'specscript';
import { join } from 'path';

const spec = new SpecScript();
const specPath = join(__dirname, '../specs/product.spec');

const result = spec.validateSpec(specPath);
console.log('Validation result:', result);

if (!result.valid) {
  console.error('Validation errors:', result.errors);
  process.exit(1);
}

console.log('Spec is valid!'); 