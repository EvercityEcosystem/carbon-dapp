const buildAcronym = (str = "") => {
  const strArr = str.split(" ");
  let res = "";
  strArr.forEach((el) => {
    const [char] = el;
    if (char) {
      res += char.toUpperCase();
    }
  });

  return res;
};

export default buildAcronym;
