import { describe, expect, test } from "vitest";

import * as Module from "../index";

describe("Behavior when duplicate command definitions are entered", () => {
  test("If multiple actions exist", () => {
    expect(() => {
      new Module.Parser({
        messageItems: [
          {
            command: "create release latest",
            description: "create release 1",
          },
          {
            command: "create release latest tags:string[]",
            description: "create release 2",
          },
        ],
      });
    }).toThrow();
  });

  test("If multiple parameters are present", () => {
    expect(() => {
      new Module.Parser({
        messageItems: [
          {
            command: "create release version:string[] name:string[]",
            description: "create release 1",
          },
          {
            command: "create release tags:string[]",
            description: "create release 2",
          },
        ],
      });
    }).toThrow();
  });
});
