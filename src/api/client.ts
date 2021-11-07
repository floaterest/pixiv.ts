import https, { RequestOptions } from 'https';
import querystring from 'querystring';
import fs from 'fs';
import path from 'path';

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

    protected async post(path: string, data: KeyValuePair): Promise<void>{
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

    protected static async write(url: string, dest: string, override = false, referer: string){
        await fs.stat(dest, (err, stats) => {
            if(!err && stats.isFile() && !override){
                throw Error(`The file '${dest}' already exists!`);
            }
            // define a directory as path ending with a path separator (/ or \)
            if(err && (dest.endsWith('/') || dest.endsWith('\\'))){
                throw Error(`The directory '${dest}' does not exist!`);
            }

            // append file name if needed
            dest += stats.isDirectory() ? path.basename(url) : '';

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
        });
    }

}
