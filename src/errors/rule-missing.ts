export interface RuleMissingErrorOptions {
  ruleName: string;
}

export class RuleMissingError extends Error {
  constructor({ ruleName }: RuleMissingErrorOptions) {
    super(`Rule '${ruleName}' is missing`);
  }
}
