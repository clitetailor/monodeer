import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Scanner } from "../scanner";

interface ConsumeOptions {
  tokenOrScanner: Scanner | string | RegExp;
  notmatch?: (cursor: Cursor) => ExpressionResult;
}

export class Consume implements Expression {
  token: Scanner | string | RegExp;
  notmatch?: (cursor: Cursor) => ExpressionResult;

  constructor({ tokenOrScanner }: ConsumeOptions) {
    this.token = tokenOrScanner;
  }

  parse(cursor: Cursor): ExpressionResult {
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

    if (this.notmatch) {
      return this.notmatch(cursor);
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

    if (this.notmatch) {
      return this.notmatch(cursor);
    }

    return {
      match: false,
    };
  }
}
