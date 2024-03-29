# @himenon/message-command-parser

## Install

```bash
# One of:
npm  i   @himenon/message-command-parser
yarn add @himenon/message-command-parser
pnpm add @himenon/message-command-parser
```

## Usage

[Sample Code](./example/sample.ts) (`pnpm run test:sample`)

```ts
import { Parser } from "@himenon/message-command-parser";

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
```

## Release

- Automatic version updates are performed when merged into the `main` branch.

## LICENCE

[@Himenon/message-command-parser ](https://github.com/Himenon/message-command-parser)・MIT
