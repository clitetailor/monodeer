import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";

export class Option implements Expression {
  parse(cursor: Cursor): ExpressionResult {
    return {
      match: false,
    };
  }
}
