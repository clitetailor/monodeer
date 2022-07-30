import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";

interface SeqOptions {
  subexprs: Expression[];
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Seq implements Expression {
  subexprs: Expression[];
  _transform?: (options: TransformOptions) => ExpressionResult;

  constructor({ subexprs, transform }: SeqOptions) {
    this.subexprs = subexprs;
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();
    const items: any[] = [];

    for (const subexpr of this.subexprs) {
      const exprResult = subexpr.parse(cursor);

      items.push(exprResult.result);

      if (!exprResult.match) {
        cursor.moveTo(marker);

        return {
          match: false,
        };
      }
    }

    return {
      match: true,
      result: items,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
