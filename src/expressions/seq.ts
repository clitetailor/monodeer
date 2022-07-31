import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";

interface SeqOptions extends ExtendedOptions {
  subexprs: Expression[];
}

export class Seq extends Extended implements Expression {
  private subexprs: Expression[];

  constructor({ subexprs, transform, otherwise }: SeqOptions) {
    super({
      transform,
      otherwise,
    });

    this.subexprs = subexprs;
  }

  _parse(cursor: Cursor): ExpressionResult {
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
