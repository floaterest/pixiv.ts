import { md5 } from '../types/md5';
import { CLIENT_ID, CLIENT_SECRET, HASH_SECRET, BASE_URL, OATH_URL } from './constants';
import { Token } from '../types/token';

import axios, { AxiosInstance, AxiosResponse } from 'axios';

type NameValueCollection = Record<string, string | number | boolean>;


/**
 * returns UTC now in '%Y-%m-%dT%H:%M:%S+00:00' format
 */
function getISOTime(): string{
	return new Date().toISOString().substr(0, 19) + '+00:00';
}

export class PixivApi{
	http: AxiosInstance;
	token: Token;

	constructor(token: Token){
		this.token = token;
		this.http = axios.create({
			baseURL: BASE_URL,
			headers: {
				'User-Agent': 'PixivIOSApp/7.6.2 (iOS 12.2; iPhone9,1)',
				'Accept-Language': 'en-US',
				'App-OS': 'ios',
				'App-OS-Version': '12.2',
				'App-Version': '7.6.2',
				'Referer': 'https://app-api.pixiv.net/',
				'Authorization': `Bearer ${token.access_token}`,
			},
		});
	}


	private static async getToken(data: NameValueCollection): Promise<Token>{
		data['get_secure_url'] = 1;
		data['client_id'] = CLIENT_ID;
		data['client_secret'] = CLIENT_SECRET;
		let time = getISOTime();
		let secret = time + HASH_SECRET;
		let headers: NameValueCollection = {
			'User-Agent': 'PixivAndroidApp/5.0.115 (Android 6.0; PixivBot)',
			'X-Client-Time': time,
			'X-Client-Hash': md5(secret),
			'Accept-Language': 'en-US',
		};
		let res: AxiosResponse;
		try{
			res = await axios.post<Token>(OATH_URL, data, { headers: headers });
		}catch(e){
			console.error(e.response.data);
			throw e;
		}
		return res.data;
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
		return new PixivApi(await PixivApi.getToken(data));
	}

	/**
	 * create client with refresh token
	 * @param refresh_token
	 */
	static async refresh(refresh_token: string): Promise<PixivApi>{
		let data = {
			'grant_type': 'refresh_token',
			'refresh_token': refresh_token,
		};
		return new PixivApi(await PixivApi.getToken(data));
	}
}
