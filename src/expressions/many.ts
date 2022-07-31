import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";
import { Seq } from "./seq";

export interface ManyOptions extends ExtendedOptions {
  atLeast?: number;
  subexprs: Expression[];
}

export class Many extends Extended implements Expression {
  private atLeast: number;
  private seq: Expression;

  constructor({ subexprs, atLeast, transform, otherwise }: ManyOptions) {
    super({
      transform,
      otherwise,
    });

    this.seq = new Seq({ subexprs });
    this.atLeast = atLeast ?? 0;
  }

  _parse(cursor: Cursor): ExpressionResult {
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

    return {
      match: false,
    };
  }
}
