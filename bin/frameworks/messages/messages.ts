import { colors } from '../system/colors';

function Message(str: string, warn: boolean): string {
  if (warn) return `${colors.FgYellow}${str}${colors.Reset}`;
  else return str;
}

function SuccessMessage(str: string): string {
  return `${colors.FgGreen}${str}${colors.Reset}`;
}

export const MsgConfigDebugCli = Message(
  `USER: Command-Line configuration (Medium priority)\n`,
  true,
);
export const MsgConfigDebugEnv = Message(
  `USER: Environment configuration (Low priority)\n`,
  true,
);
export const MsgConfigDebugFinal = Message(
  `SYSTEM: Final user configuration that will be used...\n`,
  true,
);
export const MsgConfigDebugRc = Message(
  `USER: figmagic.json/.figmagicrc configuration (Highest priority)\n`,
  true,
);
export const MsgDownloadFileWritingFile = (path: string): string =>
  `\nWriting Figma graphics to disk: ${path}`;

export const MsgGeneratedFileWarning = Message(
  'THIS FILE IS AUTO-GENERATED BY FIGMAGIC. DO NOT MAKE EDITS IN THIS FILE! CHANGES WILL GET OVER-WRITTEN BY ANY FURTHER PROCESSING.',
  false,
);
export const MsgGetTokenMatchNoMatch = Message(
  `No matching token! Hard-coding to expected value:`,
  true,
);
export const MsgJobComplete = SuccessMessage(
  `\nFigmagic completed operations successfully!\n`,
);
export const MsgJobCompleteInit = SuccessMessage(
  `\nFigmagic created a base configuration (figmagic.json) for you.\n`,
);
export const MsgJobCompleteInitStopped = Message(
  `\nFigmagic tried to create a base configuration for you, but one already existed at figmagic.json...\n`,
  true,
);

export const MsgProcessElementsCreatingElement = (
  elementName: string,
  fixedName: string,
): string => `Processing Figma element "${elementName}" as ---> ${fixedName}`;
export const MsgSetDataFromApi = Message(
  `\nAttempting to fetch data from Figma API...`,
  true,
);
export const MsgSetDataFromLocal = Message(
  `\nAttempting to recompile data from local Figma JSON file...`,
  true,
);
export const MsgSetMswInterceptedDataFromApi = (url: string): string =>
  Message(
    `\n[MSW] - Mocking intercepted fetch request data from API: ${url}`,
    true,
  );
export const MsgSyncElements = Message(
  `\nAttempting to parse elements...\n`,
  true,
);
export const MsgSyncGraphics = Message(
  `\nGetting images from Figma API...`,
  true,
);
export const MsgWriteBaseFile = Message(`\nWriting Figma base file...`, true);
export const MsgWriteTokens = Message(`\nWriting design tokens...`, true);

export const MsgNoTokensFound = Message(
  `No design tokens found! Do you have a "Design tokens" page in Figma and token frames in it?\nRead more at https://github.com/mikaelvesavuori/figmagic#preparing-figma-for-figmagic-usage`,
  true,
);
