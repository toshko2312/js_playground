export const truncate = (text: string, n: number): string => {
  return (text.length > n) ? text.slice(0, n-1) + '&hellip;' : text;
};

export const toHours = (minutes: number): string => {
  if (minutes <= 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours}h ${mins}m`;
}

export const getId = () => {
	const queries = new URLSearchParams(location.search)
	if (queries.get('id')) {
		return `?id=${queries.get('id')}`
	} else return ''
}