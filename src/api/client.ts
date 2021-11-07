import https, { RequestOptions } from 'https';
import querystring from 'querystring';
import fs from 'fs';

export type Dict = Record<string, string | number | boolean>;

export class HttpClient{
    protected get options(): RequestOptions{
        return {};
    }

    protected async get<T>(path: string, params: Dict | null = null): Promise<T>{
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

    protected async post(path: string, data: Dict): Promise<void>{
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

    protected static async write(url: string, dest: string, referer: string){
        // dest must be path to a file
        const ws = fs.createWriteStream(dest);
        const req = https.get(url, { headers: { 'Referer': referer } }, res => {
            res.on('data', chunk => ws.write(chunk));
            res.on('end', () => console.log(`file written at ${dest}`));
        });

        req.on('error', err => {
            throw err;
        });
        req.on('timeout', () => {
            req.destroy();
            throw new Error('Request time out');
        });
        req.end();
    }

}
