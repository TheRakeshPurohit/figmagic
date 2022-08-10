import { Config } from '../../../contracts/Config';
import { FigmagicElement } from '../../../contracts/FigmagicElement';
import { WriteOperation } from '../../../contracts/Write';

import { writeFile } from '../../../frameworks/filesystem/writeFile';
import { checkIfExists } from '../../../frameworks/filesystem/checkIfExists';
import { getSvgFileData } from '../../../frameworks/filesystem/getSvgFileData';
import { cleanSvgData } from '../../../frameworks/string/cleanSvgData';
import { sanitizeStringPascalCase } from '../../../frameworks/string/sanitizeString';

import { ErrorWriteElements } from '../../../frameworks/errors/errors';

/**
 * @description Funnel function to write all the wanted files per element
 */
export function writeElements(
  elements: FigmagicElement[],
  config: Config,
  isGeneratingGraphics = false
): void {
  if (!elements || !config) throw Error(ErrorWriteElements);

  elements.forEach((element: FigmagicElement) => {
    const FIXED_CONFIG = makeFixedConfig(element, config);
    // TODO Refactor: writeFileHelper() should take fewer params since we are already passing in fixed config...?

    if (!config.skipFileGeneration.skipReact) {
      const PATH = `${FIXED_CONFIG.folder}/${FIXED_CONFIG.fixedName}.${FIXED_CONFIG.outputFormatElements}`;
      const TYPE = isGeneratingGraphics ? 'graphic' : 'component';
      writeFileHelper(FIXED_CONFIG, TYPE, config.outputFormatElements, checkIfExists(PATH));
    }

    if (!isGeneratingGraphics) {
      if (!config.skipFileGeneration.skipStorybook) {
        const PATH = `${FIXED_CONFIG.folder}/${FIXED_CONFIG.fixedName}.stories.${FIXED_CONFIG.outputFormatStorybook}`;
        writeFileHelper(FIXED_CONFIG, 'story', config.outputFormatStorybook, checkIfExists(PATH));
      }

      if (!config.skipFileGeneration.skipDescription) {
        const PATH = `${FIXED_CONFIG.folder}/${FIXED_CONFIG.fixedName}.description.${FIXED_CONFIG.outputFormatDescription}`;
        writeFileHelper(
          FIXED_CONFIG,
          'description',
          config.outputFormatDescription,
          checkIfExists(PATH)
        );
      }

      if (!config.skipFileGeneration.skipStyled) {
        const PATH = `${FIXED_CONFIG.folder}/${FIXED_CONFIG.fixedName}Styled.${FIXED_CONFIG.outputFormatElements}`;
        writeFileHelper(FIXED_CONFIG, 'styled', config.outputFormatElements, checkIfExists(PATH));
      }

      if (!config.skipFileGeneration.skipCss) {
        const PATH = `${FIXED_CONFIG.folder}/${FIXED_CONFIG.fixedName}Css.${FIXED_CONFIG.outputFormatCss}`;
        writeFileHelper(FIXED_CONFIG, 'css', config.outputFormatCss, checkIfExists(PATH));
      }
    }
  });
}

/**
 * @description Create an updated user configuration that is able to drive write operations
 */
const makeFixedConfig = (element: FigmagicElement, config: Config): WriteOperation => {
  const html = element.html || ' ';
  const css = element.css || ' ';
  const description = element.description || ' ';
  const name = sanitizeStringPascalCase(element.name);
  const folder = `${config.outputFolderElements}/${name}`;
  const {
    outputFormatCss,
    outputFormatDescription,
    outputFormatElements,
    outputFormatStorybook,
    outputFolderElements,
    outputFolderGraphics,
    outputFolderTokens,
    overwrite,
    tokensRelativeImportPrefix
  } = config;

  const metadata = {
    dataType: null,
    html: element.html,
    element: element.element,
    extraProps: element.extraProps,
    text: element.text || ' ',
    imports: element.imports
  };

  const templates = config.templates;
  const forceUpdate = config.skipFileGeneration.forceUpdate;
  const fixedName = name.trim().replace(/\s/g, '');

  return {
    html,
    css,
    description,
    name,
    folder,
    outputFormatCss,
    outputFormatDescription,
    outputFormatElements,
    outputFormatStorybook,
    outputFolderElements,
    outputFolderGraphics,
    outputFolderTokens,
    overwrite,
    tokensRelativeImportPrefix,
    metadata,
    templates,
    forceUpdate,
    fixedName
  } as any;
};

/**
 * @description Helper to consolidate writing the different types of files.
 */
const writeFileHelper = (
  config: WriteOperation,
  type: string,
  format: string,
  fileExists?: boolean | undefined
): void => {
  // @ts-ignore
  const shouldOverwrite = config.overwrite[type] || false;
  const forceUpdate = config.forceUpdate;

  if (!fileExists || shouldOverwrite || forceUpdate) {
    const FILE_DATA = (() => {
      if (type === 'graphic') {
        const SVG_DATA = getSvgFileData(`${config.outputFolderGraphics}/${config.fixedName}.svg`);
        return cleanSvgData(SVG_DATA);
      }
      if (type === 'description') return config.description;
      if (type === 'css') return config.css;
      return config.html;
    })();

    const {
      folder,
      fixedName,
      outputFolderElements,
      outputFolderGraphics,
      outputFolderTokens,
      tokensRelativeImportPrefix,
      metadata,
      templates
    } = config;

    writeFile({
      type,
      file: FILE_DATA,
      path: folder,
      name: fixedName,
      format,
      outputFolderElements,
      outputFolderGraphics,
      outputFolderTokens,
      tokensRelativeImportPrefix,
      metadata,
      templates
    } as WriteOperation);
  }
};
