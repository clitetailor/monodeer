import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";

interface OrOptions {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
}

export class Or implements Expression {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;

  constructor({ subexprs, notmatch }: OrOptions) {
    this.subexprs = subexprs;
    this.notmatch = notmatch;
  }

  parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    for (const subexpr of this.subexprs) {
      const exprResult = subexpr.parse(cursor);

      if (exprResult.match) {
        return exprResult;
      }

      cursor.moveTo(marker);
    }

    if (this.notmatch) {
      return this.notmatch(cursor);
    }

    return {
      match: false,
    };
  }
}
