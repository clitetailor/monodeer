import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";
import { Many } from "./many";
import { Seq } from "./seq";

interface ManyWithDelimiterOptions extends ExtendedOptions {
  atLeast?: number;
  subexprs: Expression[];
  delimiter: Expression;
}

export class ManyWithDelimiter extends Extended implements Expression {
  private atLeast: number;
  private head: Expression;
  private subseq: Expression;

  constructor({
    atLeast,
    subexprs,
    delimiter,
    transform,
    otherwise,
  }: ManyWithDelimiterOptions) {
    super({
      transform,
      otherwise,
    });

    this.atLeast = atLeast ?? 0;

    const element = new Seq({
      subexprs,
    });

    this.head = element;
    this.subseq = new Many({
      atLeast: (atLeast ?? 1) - 1,
      subexprs: [delimiter, element],
    });
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
}
