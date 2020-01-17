
export default {
	method: 'GET',
	path: '/ping',
	schema: null,
	controller: async (request, response) => {
		return response.send('OK');
	}
};
