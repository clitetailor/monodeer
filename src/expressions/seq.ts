import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";

export class Seq implements Expression {
  parse(cursor: Cursor): ExpressionResult {
    return {
      match: false,
    };
  }
}
