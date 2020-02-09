//import {normalizeName} from "src/lib/normalizeName";

import * as uuidv1 from 'uuid/v1';
import redis from 'redis';

import * as mongoose from 'mongoose';

export interface IClientApp extends mongoose.Document {
	unique_name: string;
	name: string;
	apiKey: string;
	registrationDate: Date;
}

const schema = new mongoose.Schema({
	unique_name: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	apiKey: {type: String, required: true },
	registrationDate: { type: Date, required: true }
});
//.pre('save', (next) => {
// 	if (this._doc) {
// 		let doc = <IClientApp>this._doc;
// 		doc.registrationDate = new Date();
// 		doc.unique_name = normalizeName(doc.name);
// 		doc.apiKey = uuidv1();
// 	}
// 	next();
// 	return this;
// });

schema.methods.removeAPIKey = function(cb) {
	let rClient = redis.createClient();
	let keyName = 'apiKey-' + this.apiKey;

	rClient.del(keyName, cb);
};

schema.methods.updateAPIKey = function(cb) {
	this.removeAPIKey( (err) => {
		if(err) return cb(err);
		this.apiKey = uuidv1();
		let model = mongoose.model('ClientApp', schema);
		model.findOneAndUpdate({unique_name: this.unique_name}, {apiKey: this.apiKey})
			.then( () => {
				this.registerAPIKey(cb);
			})
			.catch( (err) => {
				if(err) return cb(err);
			});
	});
};

schema.methods.registerAPIKey = function(cb) {
	let rClient = redis.createClient();
	let keyName = 'apiKey-' + this.apiKey;

	rClient.set(keyName, 1, (err, key) => {
		if(err) return cb(err);
		// rClient.expire(keyName, config.clientKeys.ttl, cb);
	});
};

export default mongoose.model('ClientApp', schema);

