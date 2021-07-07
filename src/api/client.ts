import https, { RequestOptions } from 'https';
import querystring from 'querystring';

export type KeyValuePair = Record<string, string | number | boolean>;

export class HttpClient{
	protected get options(): RequestOptions{
		return {};
	}

	protected async get<T>(path: string, params: KeyValuePair | null = null): Promise<T>{
		if(params != null) path += `?${querystring.stringify(params!)}`;

		let options = Object.assign(this.options, { path: path });
		return new Promise(((resolve, reject) => {
			const req = https.get(options, res => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => resolve(JSON.parse(data)));
			});

			req.on('error', err => reject(err));
			req.on('timeout', () => {
				req.destroy();
				reject(new Error('Request time out'));
			});
			req.end();
		}));
	}

	protected async post<T>(path: string, data: KeyValuePair): Promise<void>{
		let options = Object.assign(this.options, {
			path: path,
			method: 'post',
		});
		return new Promise((resolve, reject) => {
			const req = https.request(options, res => {
				let data = '';
				res.on('data', chunk => data += chunk);
				res.on('end', () => resolve());
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

}
