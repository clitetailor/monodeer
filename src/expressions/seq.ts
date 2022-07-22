import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";

interface SeqOptions {
  subexprs: Expression[];
}

export class Seq implements Expression {
  subexprs: Expression[];

  constructor({ subexprs }: SeqOptions) {
    this.subexprs = subexprs;
  }

  parse(cursor: Cursor): ExpressionResult {
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
}
