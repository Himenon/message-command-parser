import { describe, expect, test } from "vitest";

import * as Module from "../index";

const messageItems: Module.MessageItem[] = [
  {
    command: "create release latest",
    description: "Create Latest Release.",
  },
  {
    command: "get release tags:string[]",
    description: "Get Release Tags",
  },
];

describe("Parameter Extraction Testing", () => {
  test("get release tags:string[]", () => {
    const parser = new Module.Parser({
      messageItems: messageItems,
    });
    const output = parser.parse("get release tags:a,b,c");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: "get release tags:string[]",
      parameters: {
        tags: ["a", "b", "c"],
      },
    };
    expect(output).toStrictEqual(result);
  });

  test("get release env:string[] tags:string[]", () => {
    const parser = new Module.Parser({
      messageItems: [
        {
          command: "get release env:string[] tags:string[]",
          description: "Multiple Arguments",
        },
      ],
    });
    const output = parser.parse("get release tags:a,b,c env:alpha,feature,stable");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: "get release env:string[] tags:string[]",
      parameters: {
        tags: ["a", "b", "c"],
        env: ["alpha", "feature", "stable"],
      },
    };
    expect(output).toStrictEqual(result);
  });

  test("dot test", () => {
    const command = "get release version:string[] tags:string[]";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "Multiple Arguments",
        },
      ],
    });
    const output = parser.parse("get release version:v1.2.3 tags:v0.4.5,v0.2.3");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: command,
      parameters: {
        version: ["v1.2.3"],
        tags: ["v0.4.5", "v0.2.3"],
      },
    };
    expect(output).toStrictEqual(result);
  });

  test("- _ test", () => {
    const command = "get release version:string[]";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "複数",
        },
      ],
    });
    const output = parser.parse("get release version:0.0.0-v1.2.3debug.1,0.0.0_v1.2.3debug.2");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: command,
      parameters: {
        version: ["0.0.0-v1.2.3debug.1", "0.0.0_v1.2.3debug.2"],
      },
    };
    expect(output).toStrictEqual(result);
  });

  test("Uppercase and lowercase", () => {
    const command = "get release version:string[]";
    const parser = new Module.Parser({
      messageItems: [
        {
          command: command,
          description: "Multiple Arguments",
        },
      ],
    });
    const output = parser.parse("get release version:v0.1.2-Alpha,v0.1.3-Beta");
    const result: Module.MatchedCommandMessage = {
      kind: "command",
      action: "get",
      actionTargets: ["release"],
      matched: command,
      parameters: {
        version: ["v0.1.2-Alpha", "v0.1.3-Beta"],
      },
    };
    expect(output).toStrictEqual(result);
  });
});
