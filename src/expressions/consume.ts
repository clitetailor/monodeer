import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Scanner } from "../scanner";

interface ConsumeOptions {
  tokenOrScanner: Scanner | string | RegExp;
  transform?: (options: TransformOptions) => ExpressionResult;
}

export class Consume implements Expression {
  token: Scanner | string | RegExp;
  _transform?: (options: TransformOptions) => ExpressionResult;

  constructor({ tokenOrScanner, transform }: ConsumeOptions) {
    this.token = tokenOrScanner;
    this._transform = transform;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    return this._transform ? this._transform(exprResult) : exprResult;
  }

  _parse(cursor: Cursor): ExpressionResult {
    if (typeof this.token === "string") {
      return this.parseString(cursor);
    }

    if (this.token instanceof RegExp) {
      return this.parseRegExp(cursor);
    }

    const scanner: Scanner = this.token;

    return scanner(cursor);
  }

  parseString(cursor: Cursor): ExpressionResult {
    const token = this.token as string;

    if (cursor.startsWith(token)) {
      cursor.next(token.length);

      return {
        match: true,
        result: {
          matchResult: [this.token],
        },
      };
    }

    return {
      match: false,
    };
  }

  parseRegExp(cursor: Cursor): ExpressionResult {
    const token = this.token as RegExp;
    const regExp = token.flags.includes("y")
      ? token
      : new RegExp(token, token.flags + "y");

    const matchResult = cursor.exec(regExp);

    if (matchResult) {
      return {
        match: true,
        result: {
          matchResult: matchResult,
        },
      };
    }

    return {
      match: false,
    };
  }

  transform(transformer: (option: TransformOptions) => ExpressionResult) {
    this._transform = transformer;
  }
}
