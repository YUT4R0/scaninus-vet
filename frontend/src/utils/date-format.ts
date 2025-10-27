export function formatDate(date_str: string): string {
  const date = new Date(date_str);
  const formated = new Intl.DateTimeFormat('pt-BR').format(date);
  return formated;
}
