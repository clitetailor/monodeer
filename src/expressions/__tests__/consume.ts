import { Cursor, t } from "../../cursor";
import { ExpressionResult } from "../../expression";
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

test("'consume' expression should match regexp pattern", () => {
  const consume = new Consume({
    tokenOrScanner: /([a-z]+):[ ]*(\d+)/,
  });

  const iter = t.capture("🌵total: 12345🌵").toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: {
      matchResult: expect.arrayContaining(["total: 12345", "total", "12345"]),
    },
  });
  expect(start.isAt(end)).toBeTruthy();
});

test("'consume' expression should not match regexp pattern", () => {
  const consume = new Consume({
    tokenOrScanner: /([a-z]+)=[ ]*(\d+)/,
  });

  const iter = t.capture("🌵total: 12345🌵").toIter();

  const start = iter.next();
  const startIndex = start.index;

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(startIndex)).toBeTruthy();
});

const blockScanner = (cursor: Cursor): ExpressionResult => {
  const marker = cursor.clone();

  let startCount = 0;
  while (cursor.startsWith("=") && !cursor.isEof()) {
    startCount++;
    cursor.next(1);
  }

  if (!cursor.startsWith("{")) {
    cursor.moveTo(marker);

    return { match: false };
  }

  cursor.next(1);

  const contentMarker = cursor.clone();
  while (!cursor.startsWith("}") && !cursor.isEof()) {
    cursor.next(1);
  }

  if (!cursor.startsWith("}")) {
    cursor.moveTo(marker);

    return { match: false };
  }

  const content = contentMarker.readTo(cursor);

  cursor.next(1);

  let endCount = 0;
  while (cursor.startsWith("=") && !cursor.isEof()) {
    endCount++;
    cursor.next(1);
  }

  if (startCount !== endCount) {
    cursor.moveTo(marker);

    return {
      match: false,
    };
  }

  return {
    match: true,
    result: {
      type: "Block",
      decoratorLength: startCount,
      content,
    },
  };
};

test("'consume' expression should be scanned", () => {
  const consume = new Consume({
    tokenOrScanner: blockScanner,
  });

  const iter = t.capture("🌵====={Hello, World!}=====🌵").toIter();

  const start = iter.next();
  const end = iter.next();

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: true,
    result: {
      type: "Block",
      decoratorLength: 5,
      content: "Hello, World!",
    },
  });
  expect(start.isAt(end)).toBeTruthy();
});

test("'consume' expression should not be scanned", () => {
  const consume = new Consume({
    tokenOrScanner: blockScanner,
  });

  const iter = t.capture("🌵====={Hello, World!}==🌵").toIter();

  const start = iter.next();
  const startIndex = start.index;

  const exprResult = consume.parse(start);

  expect(exprResult).toEqual({
    match: false,
  });
  expect(start.isAt(startIndex)).toBeTruthy();
});
