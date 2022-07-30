import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Seq } from "./seq";

interface DelimiterOptions {
  subexprs: Expression[];
  delimiter: Expression;
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Delimiter implements Expression {
  subseq: Expression;
  _transform?: (options: TransformOptions) => ExpressionResult;

  constructor({ subexprs, delimiter, transform }: DelimiterOptions) {
    const subseqSubexprs: Expression[] = subexprs
      .map((subexpr, index) => {
        return index > 0 ? [delimiter, subexpr] : [subexpr];
      })
      .reduce((a, b) => a.concat(b), []);

    this.subseq = new Seq({
      subexprs: subseqSubexprs,
    });
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    return this.subseq.parse(cursor);
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
