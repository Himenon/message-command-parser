import { describe, it, expect } from "vitest";

import { hello } from "../index.js";

describe("Hello Test", () => {
  it("name check", () => {
    const result = hello("my-package");
    expect(result).toEqual('Hello my-package {"hoge":1,"fuga":2}');
  });
});
