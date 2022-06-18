const createError = (error) => {
  return Object.assign(new Error(), error);
};

module.exports = { createError };