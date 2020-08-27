import { FRAME as Frame } from '../../../app/contracts/Figma';
import { makeLineHeightTokens } from '../index';
import { LineHeightTokens } from '../Tokens';

import { camelize } from '../../../frameworks/string/camelize';
import { normalizeUnits } from '../../../frameworks/string/normalizeUnits';

import {
  ErrorSetupLineHeightTokensNoFrame,
  ErrorSetupLineHeightTokensNoChildren,
  ErrorSetupLineHeightTokensMissingProps,
  ErrorSetupLineHeightTokensMissingPercent
} from '../../../frameworks/errors/errors';

/**
 * @description Places all Figma line heights into a clean object
 *
 * @param lineHeightFrame The line heights frame from Figma
 * @param remSize The body rem size
 */
export function setupLineHeightTokens(lineHeightFrame: Frame, remSize: number): LineHeightTokens {
  if (!lineHeightFrame) throw new Error(ErrorSetupLineHeightTokensNoFrame);
  if (!lineHeightFrame.children) throw new Error(ErrorSetupLineHeightTokensNoChildren);

  const lineHeights: Record<string, unknown> = {};

  lineHeightFrame.children.forEach((item: Frame) => {
    if (!item.name || !item.style) throw new Error(ErrorSetupLineHeightTokensMissingProps);
    if (!item.style.lineHeightPercentFontSize)
      throw new Error(ErrorSetupLineHeightTokensMissingPercent);

    const name = camelize(item.name);
    const LINE_HEIGHT: string = normalizeUnits(
      item.style.lineHeightPercentFontSize,
      'percent',
      'unitless',
      remSize
    );

    // Do a tiny bit of rounding to avoid ugly numbers
    const lineHeight = parseFloat(LINE_HEIGHT).toFixed(2);
    lineHeights[name] = lineHeight;
  });

  const lineHeightTokens = makeLineHeightTokens(lineHeights);
  return lineHeightTokens;
}
