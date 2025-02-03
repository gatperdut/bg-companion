import { kernel32 } from './libs';

const GetLastError = kernel32.func('__stdcall', 'GetLastError', 'uint32', []);

export const checkError = (): number => {
  const error = GetLastError();

  console.error('*******ERROR: ', error);

  return error;
};
