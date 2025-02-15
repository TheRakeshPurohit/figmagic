import {
  FileContentAndPath,
  GetFileDataOperation,
  WriteOperation,
} from '../../contracts/Write';

import { getFileContentAndPath } from '../filesystem/getFileContentAndPath';
import {
  getElement,
  getExtraProps,
  getImports,
  getText,
} from './getDataHelpers';

import { ErrorPrepareWrite, ErrorWriteFile } from '../errors/errors';

/**
 * @description Controller that starts the prepping/formatting of the file(s)
 */
export function prepareWrite(
  writeOperation: WriteOperation,
): FileContentAndPath {
  if (!writeOperation) throw Error(ErrorWriteFile);

  const {
    type,
    file,
    path,
    name,
    format,
    outputFolderTokens,
    tokensRelativeImportPrefix,
    metadata,
    templates,
  } = writeOperation;

  if (
    (type === 'css' || type === 'story' || type === 'component') &&
    !templates
  )
    throw Error(ErrorPrepareWrite);

  const getFileDataOperation: GetFileDataOperation = {
    type,
    file,
    path,
    name: name.replace(/\s/g, ''),
    format,
    text: getText(metadata),
    element: getElement(metadata),
    imports: getImports(
      metadata,
      outputFolderTokens,
      tokensRelativeImportPrefix,
    ),
    extraProps: getExtraProps(metadata),
    metadata,
    templates,
  };

  return getFileContentAndPath(getFileDataOperation);
}
