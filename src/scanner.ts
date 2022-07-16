import { Cursor } from "./cursor";
import { ExpressionResult } from "./expression";

export type Scanner = (cursor: Cursor) => ExpressionResult;
