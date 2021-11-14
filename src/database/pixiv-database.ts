import fs from 'fs';

import { BinaryReader } from './io';

export class PixivDatabase{
    path: string;
    // username: string;

    lastModified: number;

    constructor(path: string){
        this.path = path;
        this.lastModified = 0;
        fs.readFile(path, (err, data) => {
            if(err) throw err;

            let br = new BinaryReader(data);
            this.lastModified = br.readInt();
            console.log(this.lastModified);
        });
    }
}
