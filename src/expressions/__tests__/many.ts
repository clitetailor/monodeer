import { t } from "../../cursor";
import { Consume } from "../consume";
import { Many } from "../many";

const ws = new Consume({
  tokenOrScanner: /\s*/,
});
const number = new Consume({
  tokenOrScanner: /\d+/,
});

const many = new Many({
  subexprs: [ws, number, ws],
  atLeast: 5,
});

test("'many' expression should match many pattern", () => {
  const iter = t.capture(`🌵1  2  3  4  5🌵`).toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = many.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: [
      expect.arrayContaining([
        {
          matchResult: expect.arrayContaining(["1"]),
        },
      ]),
      expect.arrayContaining([
        {
          matchResult: expect.arrayContaining(["2"]),
        },
      ]),
      expect.arrayContaining([
        {
          matchResult: expect.arrayContaining(["3"]),
        },
      ]),
      expect.arrayContaining([
        {
          matchResult: expect.arrayContaining(["4"]),
        },
      ]),
      expect.arrayContaining([
        {
          matchResult: expect.arrayContaining(["5"]),
        },
      ]),
    ],
  });
  expect(start.isAt(end));
});

test("'many' expression should not match many pattern with at least option", () => {
  const iter = t.capture(`🌵🌵1  2  3  4`).toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = many.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(end));
});

test("'many' expression should not match incorrect pattern", () => {
  const iter = t.capture(`🌵🌵1.  2.  3.  4.  5.`).toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = many.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(end));
});
