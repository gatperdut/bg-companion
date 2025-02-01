export const joinName = (nums: number[]): string => {
    let result: string[] = [];

    let i = 0;

    while (i < nums.length && nums[i]) {
        result.push(String.fromCharCode(nums[i]));

        i++;
    }

    return result.join('');
}