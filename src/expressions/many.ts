import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Seq } from "./seq";

export interface ManyOptions {
  atLeast?: number;
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
}

export class Many implements Expression {
  atLeast: number;
  seq: Expression;
  notmatch: (cursor: Cursor) => ExpressionResult;

  constructor({ subexprs, atLeast }: ManyOptions) {
    this.seq = new Seq({ subexprs });
    this.atLeast = atLeast ?? 0;
  }

  parse(cursor: Cursor): ExpressionResult {
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

    if (this.notmatch) {
      return this.notmatch(cursor);
    }

    return {
      match: false,
    };
  }
}
