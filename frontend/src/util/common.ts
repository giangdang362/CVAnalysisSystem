// ex: 2023-10-02T21:03:16.044967+07:00 ==> 02/10/2020, 21:03
const { NEXT_PUBLIC_AWS_URL } = process.env;
export const FormatDateTime = (inputDateString: string) => {
  const inputDate = new Date(inputDateString);

  const outputDate = inputDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${outputDate}`;
};

export const FormatNumber = (x: number) => {
  return Number(x).toLocaleString('en-US');
};

export const getUrlFile = (x: string) => {
  return `${NEXT_PUBLIC_AWS_URL}/${x}`;
};