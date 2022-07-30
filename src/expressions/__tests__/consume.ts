import { t } from "../../cursor";
import { Consume } from "../consume";

test("'consume' expression should match string token", () => {
  const consume = new Consume({
    tokenOrScanner: "dolor sit amet",
  });

  const iter = t
    .capture("Lorem ipsum 🌵dolor sit amet🌵, consectetur adipiscing elit.")
    .toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: { matchResult: ["dolor sit amet"] },
  });
  expect(start.isAt(end)).toBeTruthy();
});

test("'consume' expression should not match string token", () => {
  const consume = new Consume({
    tokenOrScanner: "dolor sit amet.",
  });

  const iter = t
    .capture("Lorem ipsum 🌵dolor sit amet🌵, consectetur adipiscing elit.")
    .toIter();

  const start = iter.next();

  const startIndex = start.index;

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(startIndex)).toBeTruthy();
});
