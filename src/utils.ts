export type UsecaseType = "user" | "system";

export const splitParameters = (message: string, type: UsecaseType) => {
  const regex = type === "user" ? /(\w+:[\w,\\.\-_:]+)+/ : /(\w+:[\w,:\\[\]]+)+/;
  const [firstMessage, ...paramsMessage] = message.split(regex);
  return {
    firstMessage: firstMessage.trim(),
    paramsMessage,
  };
};

/**
 * @params text key:hoge:value1,value2
 * return { key: "key:hoge", value: ["value1", "value2"] }
 */
export const extractParams = (text: string, type: UsecaseType) => {
  const regex = type === "user" ? /(:[\w,\\.\-_]+$)/ : /(:string\[\]$)/;
  const [key, splitedValueString] = text.trim().split(regex, 2);
  return {
    key: key,
    value: splitedValueString.replace(":", "").split(","),
  };
};
