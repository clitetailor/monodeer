import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";

interface OrOptions {
  subexprs: Expression[];
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Or implements Expression {
  subexprs: Expression[];
  _transform?: (option: TransformOptions) => ExpressionResult;

  constructor({ subexprs, transform }: OrOptions) {
    this.subexprs = subexprs;
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    for (const subexpr of this.subexprs) {
      const exprResult = subexpr.parse(cursor);

      if (exprResult.match) {
        return exprResult;
      }

      cursor.moveTo(marker);
    }

    return {
      match: false,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
