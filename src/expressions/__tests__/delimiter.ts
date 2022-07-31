import { t } from "../../cursor";
import { Consume } from "../consume";
import { Delimiter } from "../delimiter";
import { Or } from "../or";
import { Seq } from "../seq";

const lBracket = new Consume({
  tokenOrScanner: "[",
});
const rBracket = new Consume({
  tokenOrScanner: "]",
});
const comma = new Consume({
  tokenOrScanner: ",",
});

const ws = new Consume({
  tokenOrScanner: /\s*/,
});
const numberLiteral = new Consume({
  tokenOrScanner: /\d+/,
});
const stringLiteral = new Consume({
  tokenOrScanner: /"[^"]*"/,
});
const literal = new Or({
  subexprs: [numberLiteral, stringLiteral],
});

const array = new Delimiter({
  subexprs: [lBracket, literal, comma, literal, comma, literal, rBracket],
  delimiter: ws,
});

test("'delimiter' should match delimiter pattern", () => {
  const iter = t.capture(`  🌵[ 123, "abc", 456 ]🌵  `).toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = array.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: expect.arrayContaining([
      {
        matchResult: expect.arrayContaining(["123"]),
      },
      {
        matchResult: expect.arrayContaining(['"abc"']),
      },
      {
        matchResult: expect.arrayContaining(["456"]),
      },
    ]),
  });
  expect(start.isAt(end)).toBeTruthy();
});

test("'delimiter' should not match invalid pattern", () => {
  const iter = t.capture(`  🌵🌵[ 123, "abc" ]  `).toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = array.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(end)).toBeTruthy();
});
