import { Cursor } from "../cursor";
import { Expression, ExpressionResult, TransformOptions } from "../expression";
import { Scanner } from "../scanner";
import { Extended, ExtendedOptions } from "./extended";

interface ConsumeOptions extends ExtendedOptions {
  tokenOrScanner: Scanner | string | RegExp;
}

export class Consume extends Extended implements Expression {
  private token: Scanner | string | RegExp;

  constructor({ tokenOrScanner, transform, otherwise }: ConsumeOptions) {
    super({
      transform,
      otherwise,
    });

    this.token = tokenOrScanner;
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
      cursor.next(matchResult[0].length);

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
}
