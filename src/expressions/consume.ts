import { Cursor } from "../cursor";
import { Expression, ExpressionResult } from "../expression";
import { Scanner } from "../scanner";

interface ConsumeOptions {
  scanner: Scanner;
}

export class Consume implements Expression {
  scanner: Scanner;

  constructor({ scanner }: ConsumeOptions) {
    this.scanner = this.scanner;
  }

  parse(cursor: Cursor): ExpressionResult {
    return this.scanner(cursor);
  }
}
