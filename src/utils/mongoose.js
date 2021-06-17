const getQuery = val =>
	val
		.split(',')
		.map(v => v.trim())
		.join(' ');

export { getQuery };
