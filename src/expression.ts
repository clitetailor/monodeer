import { Cursor } from "./cursor";

export interface Expression {
  parse(cursor: Cursor): ExpressionResult;
}

export interface ExpressionResult {
  match: boolean;
  result?: any;
}
