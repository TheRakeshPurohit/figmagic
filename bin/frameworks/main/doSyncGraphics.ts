import { Config } from '../../entities/Config/Config';
import { FigmaData } from '../../entities/FigmaData/FigmaData';

import { refresh } from '../filesystem/refresh';

import { createPage } from '../../functions/process/createPage';
import { processGraphics } from '../../functions/process/processGraphics';
import { writeGraphics } from '../filesystem/writeGraphics';

import { MsgSyncGraphics } from '../messages/messages';

/**
 * @description TODO
 *
 * @param config
 * @param data
 * @param outputFolder
 */
export async function doSyncGraphics(
  config: Config,
  data: FigmaData,
  outputFolder: string
): Promise<void> {
  console.log(MsgSyncGraphics);
  try {
    const graphicsPage = createPage(data.document.children, 'Graphics');
    await refresh(outputFolder);
    const fileList = await processGraphics(graphicsPage, config);
    await writeGraphics(fileList, config);
  } catch (error) {
    throw new Error(error);
  }
}
