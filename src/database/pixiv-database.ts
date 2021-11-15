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
    /**
     * same as profile_image_urls.medium in HTTP response
     */
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
    /**
     * date of the last successful HTTP request (when visible == True)
     */
    updated_on: number;
    title: string;
    type: IllustType;
    // image_urls: included in meta_pages
    caption: string;
    restrict: Restrict;
    user: User;
    tags: Tag[];
    tools: string[];
    /**
     * iso
     */
    create_date: string;
    // page_count: use meta_pages.length
    width: number;
    height: number;
    /**
     * kinda represents how NSFW the illustration is?
     */
    sanity_level: number;
    /**
     * true if r18
     */
    x_restrict: boolean;
    series: object | null;
    /**
     * includes meta_single_page
     */
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
