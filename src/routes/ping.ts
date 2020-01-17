import log from '../lib/logger';

export default {
	method: 'GET',
	path: '/ping',
	controller: async (request, response) => {
		const { boardingPassService, db } = request.context;
		const failedtoConnect = [];
		let integrationCount;
		let activityCount;

		try {
			const integrations = await boardingPassService.getIntegrations();
			integrationCount = Array.isArray(integrations) ? integrations.length : 0;
		} catch (err) {
			log.error('-- Error Ping (integrations) --', err);
			failedtoConnect.push('integrations');
		}

		try {
			// TODO: what is this for? There is no activities table
			activityCount = await db('activities').count('id');
		} catch (err) {
			log.error('-- Error Activity Count --', err);
			failedtoConnect.push('activities');
		}

		const serverStatus = {
			isUp: true,
			integrationCount,
			activityCount,
			failedtoConnect
		};

		return response.send(serverStatus);
	}
};
