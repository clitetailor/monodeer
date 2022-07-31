import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";
import { Seq } from "./seq";

interface OptionOptions extends ExtendedOptions {
  subexprs: Expression[];
}

export class Option extends Extended implements Expression {
  private seq: Expression;

  constructor({ subexprs, transform, otherwise }: OptionOptions) {
    super({
      transform,
      otherwise,
    });

    this.seq = new Seq({ subexprs });
  }

  _parse(cursor: Cursor): ExpressionResult {
    const marker = cursor.clone();

    const exprResult = this.seq.parse(cursor);

    if (exprResult.match) {
      return exprResult;
    }

    cursor.moveTo(marker);

    return {
      match: true,
      result: null,
    };
  }
}
