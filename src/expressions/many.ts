import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Seq } from "./seq";

export interface ManyOptions {
  atLeast?: number;
  subexprs: Expression[];
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Many implements Expression {
  atLeast: number;
  seq: Expression;
  _transform?: (options: TransformOptions) => ExpressionResult;

  constructor({ subexprs, atLeast, transform }: ManyOptions) {
    this.seq = new Seq({ subexprs });
    this.atLeast = atLeast ?? 0;
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();
    const items: any[] = [];

    let matched = true;
    while (!cursor.isEof() && matched) {
      const exprResult = this.seq.parse(cursor);

      if (exprResult.match) {
        matched = true;
        items.push(exprResult.result);
      } else {
        matched = false;
      }
    }

    if (items.length >= this.atLeast) {
      return {
        match: true,
        result: items,
      };
    }

    cursor.moveTo(marker);

    return {
      match: false,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
