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
    return {
      match: false,
    };
  }
}
