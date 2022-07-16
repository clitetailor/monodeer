import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Seq } from "./seq";

interface OptionOptions {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
}

export class Option implements Expression {
  seq: Expression;
  notmatch?: (cursor: Cursor) => ExpressionResult;

  constructor({ subexprs, notmatch }: OptionOptions) {
    this.seq = new Seq({ subexprs });
    this.notmatch = notmatch;
  }

  parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    const exprResult = this.seq.parse(cursor);

    if (exprResult.match) {
      return exprResult;
    }

    cursor.moveTo(marker);

    if (this.notmatch) {
      return this.notmatch(cursor);
    }

    return {
      match: false,
    };
  }
}
