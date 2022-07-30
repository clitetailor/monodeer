import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";

interface SeqOptions {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
}

export class Seq implements Expression {
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;

  constructor({ subexprs, notmatch }: SeqOptions) {
    this.subexprs = subexprs;
    this.notmatch = notmatch;
  }

  parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();
    const items: any[] = [];

    for (const subexpr of this.subexprs) {
      const exprResult = subexpr.parse(cursor);

      items.push(exprResult.result);

      if (!exprResult.match) {
        cursor.moveTo(marker);

        if (this.notmatch) {
          return this.notmatch(cursor);
        }

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
}
