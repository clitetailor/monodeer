import { t } from "../../cursor";
import { Consume } from "../consume";
import { Seq } from "../seq";

const ws = new Consume({
  tokenOrScanner: /\s*/,
});
const backslash = new Consume({
  tokenOrScanner: "\\",
});
const lbrace = new Consume({
  tokenOrScanner: "{",
});
const rbrace = new Consume({
  tokenOrScanner: "}",
});
const identifier = new Consume({
  tokenOrScanner: /\w+/,
});
const blockContent = new Consume({
  tokenOrScanner: /[^}]+/,
});
const semicolon = new Consume({
  tokenOrScanner: ";",
});

const seq = new Seq({
  subexprs: [
    backslash,
    identifier,
    ws,
    lbrace,
    blockContent,
    rbrace,
    ws,
    semicolon,
  ],
  transform: ({ result }) => {
    const [, identifierResult, , , contentResult] = result;
    const {
      matchResult: [content],
    } = contentResult;
    const {
      matchResult: [id],
    } = identifierResult;

    return {
      type: "Tag",
      identifier: {
        type: "Identifier",
        value: id,
      },
      block: {
        type: "Block",
        content,
      },
    };
  },
});

test("'seq' expression should match seq pattern", () => {
  const iter = t
    .capture(
      `
        🌵\\bold {Today is Monday};🌵
      `
    )
    .toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = seq.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: {
      type: "Tag",
      identifier: {
        type: "Identifier",
        value: "bold",
      },
      block: {
        type: "Block",
        content: "Today is Monday",
      },
    },
  });
  expect(start.isAt(end)).toBeTruthy();
});

test("'seq' expression should not match seq pattern", () => {
  const iter = t
    .capture(
      `
        🌵\\bold {Today is Monday}🌵
      `
    )
    .toIter();

  const start = iter.next();
  const startIndex = start.index;

  const exprResult = seq.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(startIndex)).toBeTruthy();
});
