import { Cursor, t } from "../../cursor";
import { ExpressionResult } from "../../expression";
import { Extended, ExtendedOptions } from "../extended";

interface TExpressionOptions extends ExtendedOptions {
  match: boolean;
  result?: any;
}

class TExpression extends Extended {
  private result: any;
  private match: boolean;

  constructor({ match, result, transform, otherwise }: TExpressionOptions) {
    super({
      transform,
      otherwise,
    });

    this.result = result;
    this.match = match;
  }

  _parse(cursor: Cursor): ExpressionResult {
    return {
      match: this.match,
      result: this.result,
    };
  }
}

test("'transform' should transform result correctly", () => {
  const expr = new TExpression({
    match: true,
    result: {
      matchResult: ["a = 5", "a", "5"],
    },
    transform: ({ result }) => {
      const {
        matchResult: [, identifier, value],
      } = result;

      return {
        type: "VariableDeclaration",
        identifier: {
          type: "Identifier",
          name: identifier,
        },
        literal: {
          type: "Literal",
          value,
        },
      };
    },
  });

  const exprResult = expr.parse(Cursor.from(""));

  expect(exprResult).toEqual({
    match: true,
    result: {
      type: "VariableDeclaration",
      identifier: {
        type: "Identifier",
        name: "a",
      },
      literal: {
        type: "Literal",
        value: "5",
      },
    },
  });
});

test("'transform' chaining method should work correctly", () => {
  const expr = new TExpression({
    match: true,
    result: {
      matchResult: ["a = 5", "a", "5"],
    },
  }).transform(({ result }) => {
    const {
      matchResult: [, identifier, value],
    } = result;

    return {
      type: "VariableDeclaration",
      identifier: {
        type: "Identifier",
        name: identifier,
      },
      literal: {
        type: "Literal",
        value,
      },
    };
  });

  const exprResult = expr.parse(Cursor.from(""));

  expect(exprResult).toEqual({
    match: true,
    result: {
      type: "VariableDeclaration",
      identifier: {
        type: "Identifier",
        name: "a",
      },
      literal: {
        type: "Literal",
        value: "5",
      },
    },
  });
});

test("'otherwise' should transform result correctly", () => {
  const expr = new TExpression({
    match: false,
    otherwise: ({ cursor }) => {
      return {
        type: "Error",
        message: `declaration or statement expected at ${cursor.index}`,
      };
    },
  });

  const iter = t.capture("a = 5;🌵;b = 6;").toIter();

  const exprResult = expr.parse(iter.next());

  expect(exprResult).toEqual({
    match: false,
    result: {
      type: "Error",
      message: "declaration or statement expected at 6",
    },
  });
});

test("'otherwise' chaining method should work correctly", () => {
  const expr = new TExpression({
    match: false,
  }).otherwise(({ cursor }) => {
    return {
      type: "Error",
      message: `declaration or statement expected at ${cursor.index}`,
    };
  });

  const iter = t.capture("a = 5;🌵;b = 6;").toIter();

  const exprResult = expr.parse(iter.next());

  expect(exprResult).toEqual({
    match: false,
    result: {
      type: "Error",
      message: "declaration or statement expected at 6",
    },
  });
});
