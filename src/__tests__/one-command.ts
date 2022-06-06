import { describe, expect, test } from "vitest";

import * as Module from "../index";

describe("Parameter Extraction Testing", () => {
  test("ping", () => {
    const command = "ping";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "ping command",
        },
      ],
    });
    const output = parser.parse("ping");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: command,
      actionTargets: [],
      matched: "ping",
    };
    expect(output).toStrictEqual(result);
  });

  test("ping + space", () => {
    const command = "ping";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "ping command",
        },
      ],
    });
    const output = parser.parse("ping  ");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: command,
      actionTargets: [],
      matched: "ping",
    };
    expect(output).toStrictEqual(result);
  });

  test("space + ping + space", () => {
    const command = "ping";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "ping command",
        },
      ],
    });
    const output = parser.parse("  ping  ");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: command,
      actionTargets: [],
      matched: "ping",
    };
    expect(output).toStrictEqual(result);
  });
});
