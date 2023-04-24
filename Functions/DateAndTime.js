function diffrenceInDays(date_1, date_2) {
  const date1 = new Date(date_1);
  const date2 = new Date(date_2);
  const diffrenceInTime = Math.abs(date1.getTime() - date2.getTime());
  const diffrenceInDays = diffrenceInTime / (1000 * 3600 * 24);
  return diffrenceInDays + 1;
}

module.exports = diffrenceInDays;
