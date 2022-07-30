import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";

export class Subrule implements Expression {
  _transform?: (options: TransformOptions) => ExpressionResult;

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    return {
      match: false,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
