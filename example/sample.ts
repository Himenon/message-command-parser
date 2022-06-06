// pnpm run exec:sample
import { Parser } from "../src/index.js";

const messageParser = new Parser({
  messageItems: [
    {
      command: "ping",
      description: "ping",
    },
    {
      command: "get release tags:string[]",
      description: "Get Release By Tags",
    },
  ],
});

const showParsedValue = (message: string) => {
  const parsedValue = messageParser.parse(message);

  if (parsedValue.kind === "plain") {
    console.log({
      message: parsedValue.message,
    });
  } else if (parsedValue.kind === "command") {
    console.log({
      action: parsedValue.action,
      actionTargets: parsedValue.actionTargets,
      parameters: parsedValue.parameters || {},
    });
  }
};

showParsedValue("get release tags:v1.0.0,v1.1.0");
// {
//   action: 'get',
//   actionTargets: [ 'release' ],
//   parameters: { tags: [ 'v1.0.0', 'v1.1.0' ] }
// }

showParsedValue("ping");
// { action: 'ping', actionTargets: [], parameters: {} }

showParsedValue("unregistered command");
// { message: 'unregistered command' }
