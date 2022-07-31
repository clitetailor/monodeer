import { t } from "../../cursor";
import { Consume } from "../consume";
import { Or } from "../or";

const word = new Consume({
  tokenOrScanner: /[a-zA-Z]+/,
});
const number = new Consume({
  tokenOrScanner: /\d+/,
});

const or = new Or({
  subexprs: [word, number],
});

test("'or' expression should match or pattern", () => {
  const iter = t.capture(`  🌵12345🌵 🌵abcde🌵  `).toIter();

  ["12345", "abcde"].forEach((value) => {
    const start = iter.next();
    const end = iter.next();

    const exprResult = or.parse(start);

    expect(exprResult).toEqual({
      match: true,
      result: {
        matchResult: expect.arrayContaining([value]),
      },
    });
    expect(start.isAt(end)).toBeTruthy();
  });
});

test("'or' expression should not match invalid pattern", () => {
  const iter = t.capture(`  🌵🌵??12345abcde 🌵🌵??abcde12345  `).toIter();

  Array.from({ length: 2 }).forEach((value) => {
    const start = iter.next();
    const end = iter.next();

    const exprResult = or.parse(start);

    expect(exprResult).toEqual({
      match: false,
    });
    expect(start.isAt(end)).toBeTruthy();
  });
});
