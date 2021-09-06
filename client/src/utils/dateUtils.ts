export function isSameDay(dateString: string) {
  const inputDate = new Date(dateString);
  let todaysDate = new Date();
  return inputDate.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0);
}

export function isYesterday(dateString: string) {
  const inputDate = new Date(dateString);
  const todayDate = new Date();
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  return inputDate.setHours(0, 0, 0, 0) === yesterdayDate.setHours(0, 0, 0, 0);
}
