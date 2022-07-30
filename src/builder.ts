import { Expression } from "./expression";
import { Consume } from "./expressions/consume";
import { Delimiter } from "./expressions/delimiter";
import { Many } from "./expressions/many";
import { ManyWithDelimiter } from "./expressions/many-with-delimiter";
import { Option } from "./expressions/option";
import { Or } from "./expressions/or";
import { Seq } from "./expressions/seq";
import { Subrule } from "./expressions/subrule";
import { Scanner } from "./scanner";

export class Builder {
  ruleSet: Record<string, Expression[]> = {};

  constructor() {}

  consume(tokenOrScanner: string | Scanner): Consume {
    if (typeof tokenOrScanner == "string") {
      return new Consume({
        scanner: () => {
          return {
            match: false,
          };
        },
      });
    }

    return new Consume({
      scanner: tokenOrScanner,
    });
  }

  rule(ruleName: string, subexprs: Expression[]) {
    this.ruleSet[ruleName] = subexprs;
  }

  subrule(ruleName: string): Subrule {
    return new Subrule();
  }

  seq(subexprs: Expression[]): Seq {
    return new Seq({
      subexprs,
    });
  }

  or(subexprs: Expression[]): Or {
    return new Or({
      subexprs,
    });
  }

  option(subexprs: Expression[]): Option {
    return new Option({
      subexprs,
    });
  }

  many(subexprs: Expression[]): Many {
    return new Many({
      subexprs,
    });
  }

  delimiter(subexprs: Expression[], delimiter: string): Delimiter {
    return new Delimiter();
  }

  manyWithDelimiter(subexprs: Expression[], delimiter: string | Expression) {
    const delimiterExpr =
      typeof delimiter === "string" ? this.consume(delimiter) : delimiter;

    return new ManyWithDelimiter({
      subexprs,
      delimiter: delimiterExpr,
    });
  }
}
