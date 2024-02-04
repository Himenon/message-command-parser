import { describe, expect, test } from "vitest";

import * as Module from "../index";

const messageItems: Module.MessageItem[] = [
  {
    command: "get release tags:string[]",
    description: "Get Release Tags.",
  },
  {
    command: "create release latest",
    description: "Create Release of Latest.",
  },
];

describe("Parseのテスト", () => {
  test("getActions", () => {
    const parser = new Module.Parser({
      messageItems: messageItems,
    });
    expect((parser as any).validActions).toStrictEqual(["get", "create"]);
  });

  test("createInputCommandSyntaxList", () => {
    const parser = new Module.Parser({
      messageItems: messageItems,
    });
    expect((parser as any).parsedInputCommands).toStrictEqual([
      {
        command: "get release tags:string[]",
        action: "get",
        actionTargets: ["release"],
        parameters: {
          tags: ["string[]"],
        },
      },
      {
        command: "create release latest",
        action: "create",
        actionTargets: ["release", "latest"],
      },
    ]);
  });

  test("get release", () => {
    const parser = new Module.Parser({
      messageItems: messageItems,
    });
    const output = parser.parse("get release");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: "get release tags:string[]",
    };
    expect(output).toStrictEqual(result);
  });

  test("create release latest", () => {
    const parser = new Module.Parser({
      messageItems: messageItems,
    });
    const output = parser.parse("create release latest");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      matched: "create release latest",
      action: "create",
      actionTargets: ["release", "latest"],
    };
    expect(output).toStrictEqual(result);
  });

  test("update pre-release", () => {
    const parser = new Module.Parser({
      messageItems: [
        {
          command: "update pre-release",
          description: "update pre",
        },
      ],
    });
    const output = parser.parse("update pre-release");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      matched: "update pre-release",
      action: "update",
      actionTargets: ["pre-release"],
    };
    expect(output).toStrictEqual(result);
  });
});
