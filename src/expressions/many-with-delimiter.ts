import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Many } from "./many";
import { Seq } from "./seq";

interface ManyWithDelimiterOptions {
  atLeast?: number;
  subexprs: Expression[];
  delimiter: Expression;
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class ManyWithDelimiter implements Expression {
  atLeast: number;
  head: Expression;
  subseq: Expression;
  _transform?: (options: TransformOptions) => ExpressionResult;

  constructor({
    atLeast,
    subexprs,
    delimiter,
    transform,
  }: ManyWithDelimiterOptions) {
    this.atLeast = atLeast ?? 0;

    const element = new Seq({
      subexprs,
    });

    this.head = element;
    this.subseq = new Many({
      atLeast: (atLeast ?? 1) - 1,
      subexprs: [delimiter, element],
    });

    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    let items: any[] = [];

    const headExprResult = this.head.parse(cursor);
    if (!headExprResult.match) {
      if (this.atLeast <= 0) {
        return {
          match: true,
          result: items,
        };
      }

      return {
        match: false,
      };
    }

    items.push(headExprResult.result);

    const subseqExprResult = this.subseq.parse(cursor);
    if (!subseqExprResult.match) {
      return {
        match: false,
      };
    }

    items = items.concat(subseqExprResult.result);

    return {
      match: true,
      result: items,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
