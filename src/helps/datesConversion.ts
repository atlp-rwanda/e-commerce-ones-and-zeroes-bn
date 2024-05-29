export const millisecondsToDate = (milliseconds: any) => {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  return formattedDate;
};

export const dateToMillseconds = (dateString: String) => {
  const inputDate = new Date(`${dateString}T00:00:00`); // Convert to date object at midnight
  const milliseconds = inputDate.getTime();
  return milliseconds;
};
