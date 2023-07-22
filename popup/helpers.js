/* function to make sure a number is inside a range */
const isNumberInRange = (range = [0, 2], number = 1) => number > range[0] && number < range[1]

export { isNumberInRange }
