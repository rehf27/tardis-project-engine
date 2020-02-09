export default {
	server: {
		port: process.env.APP_PORT || 3000,
		router: {
			caseSensitive: false,
			mergeParams: false,
			strict: false
		}
	},
	db: {
		charset: 'utf8',
		client: 'pg',
		debug: process.env.DEBUG || false,
		pool: {
			min: process.env.POSTGRES_POOL_MIN || 2,
			max: process.env.POSTGRES_POOL_MAX || 10
		},
		connection: {
			host: process.env.POSTGRES_HOST || 'db',
			port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
			user: process.env.POSTGRES_USER || 'postgres',
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.NODE_ENV === 'test' ? 'postgres_test' : (process.env.POSTGRES_DB_NAME || 'postgres')
		}
	},
	logging: {
		output_files: {
			error: './logs/errors.log'
		}
	},
	mongoose: {
		connection_string: 'mongodb://localhost/games'
	},
	clientKeys: {
		ttl: 2592000
	},
	redis: {
		connectionInfo: {
			host: '127.0.0.1',
			port: 6379
		}
	},
	playerstats: {
		defaulthp: 10,
		speed: 2
	},
	errorCodes: {
		invalidCommand: 1
	},
	returnCompleteErrors: process.env.RETURN_COMPLETE_ERRORS === 'true'
};
