import { RootRuleError, SubruleError } from "./errors/rule";
import { Expression } from "./expression";
import { Consume } from "./expressions/consume";
import { Delimiter } from "./expressions/delimiter";
import { Many } from "./expressions/many";
import { ManyWithDelimiter } from "./expressions/many-with-delimiter";
import { Option } from "./expressions/option";
import { Or } from "./expressions/or";
import { Seq } from "./expressions/seq";
import { Subrule } from "./expressions/subrule";
import { Parser } from "./parser";
import { Scanner } from "./scanner";

export interface BuildOptions {
  rootRule: string;
}

export interface ValidateOptions {
  rootRule: string;
}

export class Builder {
  private ruleSet: Record<string, Expression> = {};
  private subrules: string[] = [];

  constructor() {}

  consume(tokenOrScanner: Scanner | string | RegExp): Consume {
    return new Consume({
      tokenOrScanner,
    });
  }

  rule(ruleName: string, subexprs: Expression[]) {
    this.ruleSet[ruleName] = new Seq({
      subexprs,
    });
  }

  subrule(ruleName: string): Subrule {
    this.subrules.push(ruleName);

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
    const delimiterExpr =
      typeof delimiter === "string" ? this.consume(delimiter) : delimiter;

    return new Delimiter({
      subexprs,
      delimiter: delimiterExpr,
    });
  }

  manyWithDelimiter(subexprs: Expression[], delimiter: string | Expression) {
    const delimiterExpr =
      typeof delimiter === "string" ? this.consume(delimiter) : delimiter;

    return new ManyWithDelimiter({
      subexprs,
      delimiter: delimiterExpr,
    });
  }

  build({ rootRule }: BuildOptions): Parser {
    this.validate({
      rootRule,
    });

    return new Parser({
      ruleSet: this.ruleSet,
      rootRule,
    });
  }

  private validate(options: ValidateOptions) {
    for (const subrule of this.subrules) {
      if (!this.ruleSet[subrule]) {
        throw new SubruleError({
          ruleName: subrule,
        });
      }
    }

    if (!this.ruleSet[options.rootRule]) {
      throw new RootRuleError({
        ruleName: options.rootRule,
      });
    }
  }
}
