import * as Utils from "./utils.js";

export interface PlainMessage {
  kind: "plain";
  message: string;
}

export interface CommandParameter {
  key: string;
  value: string[];
}

export interface CommandMessage {
  kind: "command";
  action: string;
  actionTargets: string[];
  parameters?: Record<string, string[]>;
}

export type MatchedCommandMessage = CommandMessage & { matched: string };

export type ParsedCommandMessage = PlainMessage | MatchedCommandMessage;

export interface MessageItem {
  /**
   * @example get release latest
   */
  command: string;
  /**
   * Command Description
   */
  description: string;
}

export interface ParsedInputCommand extends Omit<CommandMessage, "kind"> {
  command: string;
}

export interface ParserInitialize {
  messageItems: MessageItem[];
}

export class Parser {
  private readonly commandActionRegExp: RegExp;
  private readonly validActions: string[];
  private readonly parsedInputCommands: ParsedInputCommand[];

  constructor(private readonly params: ParserInitialize) {
    this.validActions = this.getValidActions();
    this.commandActionRegExp = this.createCommandActionRegExp();
    this.parsedInputCommands = this.getParsedInputCommands();
    this.validateDuplicateCommandExists();
  }

  /**
   * Parses a string into defined commands
   * If no match, returns input message without parsing
   */
  public parse(message: string): PlainMessage | MatchedCommandMessage {
    const parsedValue = this.parseMessage(message, "user");
    if (parsedValue.kind === "plain") {
      return parsedValue;
    }
    const [matchedParsedInputCommand] = this.getMatchedParsedInputCommands(parsedValue);
    if (!matchedParsedInputCommand) {
      return this.createPlainMessage(message);
    }
    return {
      ...parsedValue,
      matched: matchedParsedInputCommand.command,
    };
  }

  /**
   * Verify the existence of duplicate commands
   */
  private validateDuplicateCommandExists(): void {
    const duplicateCommands: { command: string; another: string[] }[] = [];
    this.params.messageItems.forEach(messageItem => {
      const messageCommand = this.parseMessage(messageItem.command, "system");
      if (messageCommand.kind === "plain") {
        return;
      }
      const matchedParsedInputCommands = this.getMatchedParsedInputCommands(messageCommand);
      if (matchedParsedInputCommands.length > 1) {
        duplicateCommands.push({
          command: messageItem.command,
          another: matchedParsedInputCommands.filter(item => item.command !== messageItem.command).map(item => item.command),
        });
      }
      if (duplicateCommands.length > 0) {
        const errorMessageBodies = duplicateCommands.map(duplicateCommand => {
          const texts: string[] = [`Command: "${duplicateCommand.command}"`, ...duplicateCommand.another.map(command => `- "${command}"`)];
          return texts.join("\n");
        });
        const errorMessage = ["Duplicate command definitions exist.", "", ...errorMessageBodies].join("\n");
        throw new Error(errorMessage);
      }
    });
  }

  /**
   * Array of valid action strings for this Parser
   *
   * Extract the leading `\w+` from "get hoge", "create fuga", etc. and convert them into an array ["get", "create"].
   */
  private getValidActions(): string[] {
    const actions: string[] = [];
    this.params.messageItems.forEach(({ command }) => {
      const matched = command.match(/^(?<action>\w+)/);
      if (matched) {
        const action = (matched.groups || {}).action;
        action && actions.push(action);
      }
    });
    return Array.from(new Set(actions));
  }

  /**
   * Parses input commands and converts them into programmable objects
   */
  private getParsedInputCommands(): ParsedInputCommand[] {
    const parsedInputCommands: ParsedInputCommand[] = [];
    this.params.messageItems.forEach(({ command }) => {
      const result = this.parseMessage(command, "system");
      if (result.kind === "plain") {
        return;
      }
      const parsedInputCommand: ParsedInputCommand = {
        command: command,
        action: result.action,
        actionTargets: result.actionTargets,
      };
      if (result.parameters) {
        parsedInputCommand.parameters = result.parameters;
      }
      parsedInputCommands.push(parsedInputCommand);
    });
    return parsedInputCommands;
  }

  /**
   * Regular expression that breaks down the string before the parameters string into action and actionTargets
   */
  private createCommandActionRegExp(): RegExp {
    const actions: string = this.validActions.join("|");
    const pattern = `^(?<action>${actions})[\\s+]?(?<actionTargets>([\\w\\-]+\\s?)+)?`;
    return new RegExp(pattern);
  }

  /**
   * convert input strings (`a:b:c` or `version:v0.1.2`) to key value format objects
   * for `paramsStrings` extracted by `Utils.splitParameters
   */
  private createParsedParameters(paramsStrings: string[], type: Utils.UsecaseType): Record<string, string[]> {
    const parameters: Record<string, string[]> = {};
    // only an even number.
    for (let i = 0; i < paramsStrings.length; i += 2) {
      const { key, value } = Utils.extractParams(paramsStrings[i], type);
      parameters[key] = value;
    }
    return parameters;
  }

  /**
   * Returns an array matching the commands defined during Parser initialization
   */
  private getMatchedParsedInputCommands(commandMessage: CommandMessage): ParsedInputCommand[] {
    return this.parsedInputCommands.filter(parsedInputCommand => {
      const isActionMatch = parsedInputCommand.action === commandMessage.action;
      // Perform array comparisons. Order is also subject to check
      const isActionTargetMatch = JSON.stringify(parsedInputCommand.actionTargets) === JSON.stringify(commandMessage.actionTargets);
      // console.log(JSON.stringify({ isActionMatch, isActionTargetMatch, item }));
      return isActionMatch && isActionTargetMatch;
    });
  }

  /**
   * Parsing input messages
   *
   * @param message
   * @param type "system" | "user" Use "system" for internal use and "user" for external (public) use
   * @returns
   */
  private parseMessage(message: string, type: Utils.UsecaseType): PlainMessage | CommandMessage {
    const { firstMessage, paramsMessage } = Utils.splitParameters(message, type);
    const matched = firstMessage.match(this.commandActionRegExp);
    if (!matched) {
      return this.createPlainMessage(message);
    }
    const groups: Record<string, string> = matched.groups || {};
    const commandMessage: CommandMessage = {
      kind: "command",
      action: groups.action,
      actionTargets: (groups.actionTargets || "").split(/\s/).filter(Boolean),
    };
    if (paramsMessage.length > 0) {
      commandMessage.parameters = this.createParsedParameters(paramsMessage, type);
    }
    return commandMessage;
  }

  /**
   * Object for strings that do not match the defined command
   */
  private createPlainMessage(message: string): PlainMessage {
    return {
      kind: "plain",
      message: message,
    };
  }
}
