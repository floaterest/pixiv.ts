import querystring from 'querystring';
import https, { RequestOptions } from 'https';

import { md5 } from './md5';
import { CLIENT_ID, CLIENT_SECRET, HASH_SECRET, AUTH_HOST, HOST } from './constants';
import { Token } from '../types/token';
import { HttpClient, KeyValuePair } from './client';

import { UserDetail } from '../types/user';

export class PixivApi extends HttpClient{
	token: Token;

	constructor(token: Token){
		super();
		this.token = token;
	}

	get options(): RequestOptions{
		return {
			hostname: HOST,
			headers: {
				'Accepted-Language': 'en-us',
				'Authorization': 'Bearer ' + this.token.access_token,
			},
		};
	}

	//#region OAuth

	/**
	 * send POST and get token
	 * @param data
	 */
	private static async token(data: KeyValuePair): Promise<Token>{
		Object.assign(data, {
			'get_secure_url': true,
			'include_policy': true,
			'client_id': CLIENT_ID,
			'client_secret': CLIENT_SECRET,
		});

		// UTC now in '%Y-%m-%dT%H:%M:%S+00:00' format
		const datetime = new Date().toISOString().substr(0, 19) + '+00:00';

		const options: RequestOptions = {
			hostname: AUTH_HOST,
			path: '/auth/token',
			method: 'post',
			headers: {
				'X-Client-Time': datetime,
				'X-Client-Hash': md5(datetime + HASH_SECRET),
				'Accept-Language': 'en-US',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};

		// https://stackoverflow.com/a/67094088
		return new Promise((resolve, reject) => {
			const req = https.request(options, res => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => resolve(JSON.parse(data)));
			});

			req.on('error', err => reject(err));
			req.on('timeout', () => {
				req.destroy();
				reject(new Error('Request time out'));
			});
			req.write(querystring.stringify(data));
			req.end();
		});
	}

	/**
	 * create client with email/username and password
	 * @param email
	 * @param password
	 */
	static async login(email: string, password: string): Promise<PixivApi>{
		let data = {
			'grant_type': 'password',
			'username': email,
			'password': password,
		};
		return new PixivApi(await PixivApi.token(data));
	}

	/**
	 * create client with refresh token
	 * @param refreshToken
	 */
	static async refresh(refreshToken: string): Promise<PixivApi>{
		let data = {
			'grant_type': 'refresh_token',
			'refresh_token': refreshToken,
		};
		return new PixivApi(await PixivApi.token(data));
	}

	//#endregion OAuth

	//#region get

	//#region user
	async getUserDetail(id: number = this.token.user.id): Promise<UserDetail>{
		return await this.get<UserDetail>('/v1/user/detail', {
			'user_id': id,
		});
	}

	//#endregion user
	//#endregion get
}
