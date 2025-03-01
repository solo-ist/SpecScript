import { z } from 'zod';

// Define our reserved words
export const RESERVED_WORDS = [
  'Type',
  'Properties',
  'Workflow',
  'Steps',
  'Rules',
  'When',
  'Require',
  'Apply'
] as const;

export const MODIFIERS = [
  'required',
  'optional',
  'unique',
  'one of',
  'many of'
] as const;

// Schema for validating spec files
export const SpecSchema = z.object({
  type: z.enum(RESERVED_WORDS),
  name: z.string(),
  properties: z.record(z.string(), z.object({
    type: z.string(),
    modifiers: z.array(z.enum(MODIFIERS)).optional()
  }))
});

export type Spec = z.infer<typeof SpecSchema>; 