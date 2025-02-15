import { FigmaData } from '../../contracts/FigmaData';

import { refresh } from './refresh';
import { write } from './write';

import { ErrorWriteBaseJson } from '../errors/errors';
import { MsgWriteBaseFile } from '../messages/messages';

/**
 * @description Write base Figma JSON document to disk
 */
export async function writeBaseJson(
  figmagicFolder: string,
  figmaData: string,
  data: FigmaData | Record<string, unknown>,
): Promise<void> {
  if (!figmagicFolder || !figmaData || !data) throw Error(ErrorWriteBaseJson);

  console.log(MsgWriteBaseFile);

  refresh(figmagicFolder);
  write(`${figmagicFolder}/${figmaData}`, JSON.stringify(data));
}
