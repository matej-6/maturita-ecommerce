import { expect, test } from "vitest";
import { newErrorResponse } from "./error-response";

test("newErrorResponse returns an 'ErrorResponse' if valid object is passed as parameter", () => {
  const testObject = {
    message: "some message",
    status: 500,
  };

  const result = newErrorResponse(testObject);

  expect(result).toMatchObject(testObject);
});

test("newErrorResponse returns 'undefined' if an invalid object is passed as parameter", () => {
  const testObject = {
    messagee: "some message",
    status: 500,
  };

  const result = newErrorResponse(testObject);
  expect(result).toBeUndefined();
});

test("newErrorResponse returns 'undefined' if undefined is passed as parameter", () => {
  const testObject = undefined;
  const result = newErrorResponse(testObject);
  expect(result).toBeUndefined();
});
