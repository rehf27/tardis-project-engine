'use strict';

const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpackOpts = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'none',
	entry: {
		server: './server.ts'
	},
	target: 'node',
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	resolve: {
		extensions: ['.ts'],
		modules: [
			'node_modules',
			'src'
		],
		plugins: [
			new TsConfigPathsPlugin()
		]
	},
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.ts$/,
			loaders: 'awesome-typescript-loader'
		}]
	},
	externals: [nodeExternals()]
};

module.exports = webpackOpts;
