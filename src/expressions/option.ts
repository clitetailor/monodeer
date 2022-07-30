import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Seq } from "./seq";

interface OptionOptions {
  subexprs: Expression[];
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Option implements Expression {
  seq: Expression;
  _transform?: (option: TransformOptions) => ExpressionResult;

  constructor({ subexprs, transform }: OptionOptions) {
    this.seq = new Seq({ subexprs });
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    const exprResult = this.seq.parse(cursor);

    if (exprResult.match) {
      return exprResult;
    }

    cursor.moveTo(marker);

    return {
      match: false,
    };
  }
}
