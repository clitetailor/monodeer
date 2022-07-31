import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";

interface OrOptions extends ExtendedOptions {
  subexprs: Expression[];
}

export class Or extends Extended implements Expression {
  private subexprs: Expression[];

  constructor({ subexprs, transform, otherwise }: OrOptions) {
    super({
      transform,
      otherwise,
    });

    this.subexprs = subexprs;
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    for (const subexpr of this.subexprs) {
      const exprResult = subexpr.parse(cursor);

      if (exprResult.match) {
        return exprResult;
      }

      cursor.moveTo(marker);
    }

    return {
      match: false,
    };
  }
}
