import { camelize } from '../helpers/camelize';

import {
  ErrorSetupEasingTokensNoFrame,
  ErrorSetupEasingTokensNoChildren,
  ErrorSetupEasingTokensMissingProps
} from '../../frameworks/errors/errors';

import { Frame } from '../../entities/Frame/Frame';

/**
 * Places all Figma easings into a clean object
 *
 * @param easingFrame The easings frame from Figma
 */
export function setupEasingTokens(easingFrame: Frame): EasingTokens {
  if (!easingFrame) throw new Error(ErrorSetupEasingTokensNoFrame);
  if (!easingFrame.children) throw new Error(ErrorSetupEasingTokensNoChildren);

  let easingObject = {};

  easingFrame.children.forEach((type) => {
    if (!type.name || !type.characters) throw new Error(ErrorSetupEasingTokensMissingProps);

    const name = camelize(type.name);

    easingObject[name] = type.characters.trim();
  });

  return easingObject;
}
