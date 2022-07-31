import { t } from "../../cursor";
import { Consume } from "../consume";
import { Option } from "../option";
import { Seq } from "../seq";

const minus = new Consume({
  tokenOrScanner: "-",
});
const digits = new Consume({
  tokenOrScanner: /\d+/,
});

const seq = new Seq({
  subexprs: [
    new Option({
      subexprs: [minus],
    }),
    digits,
  ],
});

test("'option' expression should match pattern with optional symbol", () => {
  const iter = t.capture("🌵-12345🌵").toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = seq.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: [
      [
        {
          matchResult: expect.arrayContaining(["-"]),
        },
      ],
      {
        matchResult: expect.arrayContaining(["12345"]),
      },
    ],
  });
  expect(start.isAt(end));
});

test("'option' expression should match pattern without optional symbol", () => {
  const iter = t.capture("🌵12345🌵").toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = seq.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: [
      null,
      {
        matchResult: expect.arrayContaining(["12345"]),
      },
    ],
  });
  expect(start.isAt(end));
});

test("'option' expression should not match invalid pattern", () => {
  const iter = t.capture("🌵🌵+12345").toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = seq.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(end));
});
