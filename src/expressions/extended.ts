import { Cursor } from "../cursor";
import {
  Expression,
  ExpressionResult,
  OtherwiseOptions,
  TransformOptions,
} from "../expression";

export interface ExtendedOptions {
  transform?: (options: TransformOptions) => any;
  otherwise?: (options: OtherwiseOptions) => any;
}

export abstract class Extended implements Expression {
  private _transform?: (options: TransformOptions) => any;
  private _otherwise?: (options: OtherwiseOptions) => any;

  constructor({ transform, otherwise }: ExtendedOptions) {
    this._transform = transform;
    this._otherwise = otherwise;
  }

  parse(cursor: Cursor): ExpressionResult {
    const exprResult = this._parse(cursor);

    if (exprResult.match) {
      return this._transform
        ? {
            match: true,
            result: this._transform({
              ...exprResult,
              cursor,
            }),
          }
        : exprResult;
    }

    return this._otherwise
      ? {
          match: false,
          result: this._otherwise({
            ...exprResult,
            cursor,
          }),
        }
      : exprResult;
  }

  abstract _parse(cursor: Cursor): ExpressionResult;

  transform(transformer: (options: TransformOptions) => any): this {
    this._transform = transformer;
    return this;
  }

  otherwise(transformer: (options: OtherwiseOptions) => any): this {
    this._otherwise = transformer;
    return this;
  }
}
