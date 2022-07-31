import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Extended, ExtendedOptions } from "./extended";
import { Seq } from "./seq";

interface DelimiterOptions extends ExtendedOptions {
  subexprs: Expression[];
  delimiter: Expression;
}

export class Delimiter extends Extended implements Expression {
  private subseq: Expression;

  constructor({ subexprs, delimiter, transform, otherwise }: DelimiterOptions) {
    super({ transform, otherwise });

    const subseqSubexprs: Expression[] = subexprs
      .map((subexpr, index) => {
        return index > 0 ? [delimiter, subexpr] : [subexpr];
      })
      .reduce((a, b) => a.concat(b), []);

    this.subseq = new Seq({
      subexprs: subseqSubexprs,
    });
  }

  _parse(cursor: Cursor): ExpressionResult {
    return this.subseq.parse(cursor);
  }
}
