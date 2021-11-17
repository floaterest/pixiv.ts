import https, { RequestOptions } from 'https';
import querystring from 'querystring';
import fs from 'fs';
import { IncomingMessage } from 'http';
import { URL } from 'url';

export type Dict = Record<string, string | number | boolean>;

export class HttpClient{
    protected get options(): RequestOptions{
        return {};
    }

    private static async request(options: RequestOptions, callback: (res: IncomingMessage) => void, data: Dict = {}){
        const req = https.request(options, res => callback(res));
        req.on('error', err => {
            throw err;
        });
        req.on('timeout', () => {
            req.destroy();
            throw Error(`Request to ${options.path} timed out`);
        });
        if(data) req.write(querystring.stringify(data));
        req.end();
    }

    protected async get<T>(path: string, params: Dict = {}): Promise<T>{
        if(params) path += `?${querystring.stringify(params)}`;
        let options = Object.assign(this.options, {
            method: 'get',
            path: path,
        });
        return new Promise<T>((resolve, reject) => {
            HttpClient.request(options, res => {
                if(res.statusCode != 200) reject(`${res.statusCode} ${res.statusMessage}`);

                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data) as T));
            });
        });
    }

    protected async post(path: string, data: Dict): Promise<void>{
        let options = Object.assign(this.options, {
            method: 'post',
            path: path,
        });
        return new Promise((resolve, reject) => {
            HttpClient.request(options, res => {
                if(res.statusCode != 200) reject(`${res.statusCode} ${res.statusMessage}`);

                res.on('end', () => resolve());
            }, data);
        });
    }

    protected static async write(url: string, dest: string, referer: string): Promise<boolean>{
        let u = new URL(url);
        let options: RequestOptions = {
            hostname: u.hostname,
            path: u.pathname,
            method: 'get',
            headers: {
                'Referer': referer,
            },
        };
        return new Promise((resolve, reject) => {
            // dest must be path to a file
            const ws = fs.createWriteStream(dest);
            HttpClient.request(options, res => {
                if(res.statusCode != 200) reject(`${res.statusCode} ${res.statusMessage}`);

                res.on('data', chunk => ws.write(chunk));
                res.on('end', () => resolve(true));
            });
        });
    }

}
