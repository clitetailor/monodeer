import { Cursor } from "./cursor";
import { Expression, ExpressionResult } from "./expression";

export interface ParserOptions {
  ruleSet: Record<string, Expression[]>;
}

export class Parser {
  ruleSet = {};

  constructor({ ruleSet }: ParserOptions) {
    this.ruleSet = ruleSet;
  }

  parse(rootRule: string, cursor: Cursor): ExpressionResult {
    return {
      match: false,
    };
  }
}
