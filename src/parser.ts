import { Cursor } from "./cursor";
import { Expression, ExpressionResult } from "./expression";

export interface ParserOptions {
  ruleSet: Record<string, Expression>;
  rootRule: string;
}

export class Parser {
  private ruleSet: Record<string, Expression> = {};
  private rootRule: string;

  constructor({ ruleSet, rootRule }: ParserOptions) {
    this.ruleSet = ruleSet;
    this.rootRule = rootRule;
  }

  parse(cursor: Cursor): ExpressionResult {
    return this.ruleSet[this.rootRule].parse(cursor);
  }
}
