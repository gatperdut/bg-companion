export const joinName = (nums: number[]): string => {
  const result: string[] = [];

  let i = 0;

  while (i < nums.length && nums[i]) {
    result.push(String.fromCharCode(nums[i]));

    i++;
  }

  return result.join('');
};
