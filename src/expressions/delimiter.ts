import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Seq } from "./seq";

interface DelimiterOptions {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
  delimiter: Expression;
}

export class Delimiter implements Expression {
  subseq: Expression;

  constructor({ subexprs, notmatch, delimiter }: DelimiterOptions) {
    const subseqSubexprs: Expression[] = subexprs
      .map((subexpr, index) => {
        return index > 0 ? [delimiter, subexpr] : [subexpr];
      })
      .reduce((a, b) => a.concat(b), []);

    this.subseq = new Seq({
      subexprs: subseqSubexprs,
      notmatch,
    });
  }

  parse(cursor: Cursor): ExpressionResult {
    return this.subseq.parse(cursor);
  }
}
