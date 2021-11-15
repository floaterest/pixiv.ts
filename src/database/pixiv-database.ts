import fs from 'fs';

import { BinaryReader } from './io';
import { Restrict } from '../api/types/pixiv-object';

enum IllustType{
    illust,
    manga,
    ugoira
}

interface User{
    id: number
    name: string
    account: string
    profile_image_urls: string
    is_followed: boolean
}

interface Tag{
    name: string,
    translated_name: string
}

interface MetaPage{
    square_medium: string
    medium: string
    large: string
    original: string
}

interface Illustration{
    id: number;
    updated_on: number;
    title: string;
    type: IllustType;
    caption: string;
    restrict: Restrict;
    user: User;
    tags: Tag[];
    tools: string[];
    create_date: string;
    width: number;
    height: number;
    sanity_level: number;
    x_restrict: boolean;
    series: object | null;
    meta_pages: MetaPage[];
    total_views: number;
    total_bookmarks: number;
    is_bookmarked: boolean;
    visible: boolean;
    is_muted: boolean;
    total_comments: number;
}

export class PixivDatabase{
    //#region properties
    path: string;
    // username: string;

    lastModified!: number;
    illustrations!: [];

    //#endregion properties
    private r!: BinaryReader;

    constructor(path: string){
        this.path = path;
        fs.readFile(path, (err, data) => {
            if(err) throw err;

            this.r = new BinaryReader(data);
        });
    }
}
