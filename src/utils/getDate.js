export function getDateSimple() {
  const date = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,  // Use 24-hour time format
  };

  const formatter = new Intl.DateTimeFormat('pt-BR', options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}
