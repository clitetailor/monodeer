export interface SubruleErrorOptions {
  ruleName: string;
}

export class SubruleError extends Error {
  constructor({ ruleName }: SubruleErrorOptions) {
    super(`Rule '${ruleName}' is not defined`);
  }
}

export interface RootRuleErrorOptions {
  ruleName: string;
}

export class RootRuleError extends Error {
  constructor({ ruleName }: RootRuleErrorOptions) {
    super(`Rule '${ruleName}' is not defined`);
  }
}
