import { FRAME as Frame } from './Figma';

export interface Metadata {
  text: string;
  dataType: null | 'enum';
  element: Frame;
  extraProps: any[];
  imports: any[];
}
