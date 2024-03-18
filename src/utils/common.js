export const to = (promise, errorExt) => {
  return promise
    .then((data) => [null, data])
    .catch((err) => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt);
        return [parsedError, undefined];
      }
      return [err, undefined];
    });
};

// 识别浮点数的小数位数
export const countDecimals = value => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};
