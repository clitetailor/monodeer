import { Cursor } from "./cursor";
import { ExpressionResult } from "./expression";

export class Parser {
  ruleSet = {};

  constructor() {}

  parse(rootRule: string, cursor: Cursor): ExpressionResult {
    return {
      match: false,
    };
  }
}
