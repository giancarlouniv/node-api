function check_lenght(str, min) {
  if (str.length < min) {
    return false;
  }
  return true;
}

module.exports = check_lenght;
