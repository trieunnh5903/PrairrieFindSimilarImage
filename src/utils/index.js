export const getTimeNow = () => {
  // Lấy ngày, tháng, năm
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // Lấy giờ, phút, giây
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
};

export const getDateNow = () => {
  // Lấy ngày, tháng, năm
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const formattedDateTime = `${day}/${month}/${year}`;
  return formattedDateTime;
};
