import koffi from 'koffi/indirect';
import { CHAR } from './primitives';

export const CHAR_ARRAY = (length: number) => {
  return koffi.array(CHAR, length, 'Array');
};
