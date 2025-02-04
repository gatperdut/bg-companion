import { GetLastError } from './koffi/defs/methods/error';

export const checkError = (): number => {
  const error = GetLastError();

  console.error('ERROR: ', error);

  return error;
};
