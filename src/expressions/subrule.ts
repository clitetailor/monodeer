import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";

export interface SubruleOptions extends ExtendedOptions {
  ruleSet: Record<string, Expression>;
  ruleName: string;
}

export class Subrule extends Extended implements Expression {
  private ruleSet: Record<string, Expression>;
  private ruleName: string;

  constructor({ ruleSet, ruleName, transform, otherwise }: SubruleOptions) {
    super({
      transform,
      otherwise,
    });

    this.ruleSet = ruleSet;
    this.ruleName = ruleName;
  }

  _parse(cursor: Cursor): ExpressionResult {
    return this.ruleSet[this.ruleName].parse(cursor);
  }
}
