import { Cursor } from "./cursor";

export interface Expression {
  parse(cursor: Cursor): ExpressionResult;
}

export interface ExpressionResult {
  match: boolean;
  result?: any;
}

export interface TransformOptions extends ExpressionResult {
  cursor: Cursor;
}

export interface OtherwiseOptions extends ExpressionResult {
  cursor: Cursor;
}
