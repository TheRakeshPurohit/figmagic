import { WriteOperation } from '../../contracts/Write';

import { createFolder } from './createFolder';
import { createMissingFoldersFromPath } from './createMissingFoldersFromPath';
import { prepareWrite } from './prepareWrite';
import { write } from './write';

import { acceptedFileTypes } from '../system/acceptedFileTypes';

import { ErrorWriteFile, ErrorWriteFileWrongType } from '../errors/errors';

/**
 * @description Handles writing files to disk, complete with pre-processing.
 */
export function writeFile(writeOperation: WriteOperation): void {
  try {
    if (!writeOperation) throw Error(ErrorWriteFile);

    const {
      type,
      file,
      path,
      name,
      format,
      outputFolderTokens,
      overwrite,
      tokensRelativeImportPrefix,
      metadata,
      templates
    } = writeOperation;
    if (!file || !path || !name || !type) throw Error(ErrorWriteFile);

    const TYPE: any = typeof type === 'string' ? type.toLowerCase() : 'null';
    if (!acceptedFileTypes.includes(TYPE)) throw Error(ErrorWriteFileWrongType);

    // Create required directory/folder structure
    const fixedPath =
      name.split('/').length > 1 || type === 'component' || type === 'graphic'
        ? `${path.split('/')[0]}/${name}/`
        : path;
    if (type === 'component' || type === 'graphic') createMissingFoldersFromPath(fixedPath);
    else createFolder(path);

    const prepareWriteOperation: WriteOperation = {
      type: TYPE,
      file,
      path: fixedPath,
      name: name.split('/')[name.split('/').length - 1],
      format,
      outputFolderTokens,
      overwrite,
      tokensRelativeImportPrefix,
      metadata,
      templates
    };

    const { filePath, fileContent } = prepareWrite(prepareWriteOperation);
    write(filePath, fileContent);
  } catch (error: any) {
    throw Error(error);
  }
}
