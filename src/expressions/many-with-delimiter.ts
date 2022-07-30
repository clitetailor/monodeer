import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Many } from "./many";
import { Seq } from "./seq";

interface ManyWithDelimiterOptions {
  atLeast?: number;
  subexprs: Expression[];
  notmatch?: (cursor: Cursor) => ExpressionResult;
  delimiter: Expression;
}

export class ManyWithDelimiter implements Expression {
  atLeast: number;
  head: Expression;
  subseq: Expression;
  notmatch?: (cursor: Cursor) => ExpressionResult;

  constructor({
    atLeast,
    subexprs,
    notmatch,
    delimiter,
  }: ManyWithDelimiterOptions) {
    this.atLeast = atLeast ?? 0;

    const element = new Seq({
      subexprs,
      notmatch,
    });

    this.head = element;
    this.subseq = new Many({
      atLeast: (atLeast ?? 1) - 1,
      subexprs: [delimiter, element],
    });
  }

  parse(cursor: Cursor): ExpressionResult {
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

      if (this.notmatch) {
        return this.notmatch(cursor);
      }

      return {
        match: false,
      };
    }

    items.push(headExprResult.result);

    const subseqExprResult = this.subseq.parse(cursor);
    if (!subseqExprResult.match) {
      if (this.notmatch) {
        return this.notmatch(cursor);
      }

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
}
