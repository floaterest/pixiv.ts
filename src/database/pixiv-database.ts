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

    private read(type: 'Illustration' | 'MetaPage' | 'Tag' | 'User'): Illustration | MetaPage | Tag | User{
        switch(type){
            case 'Illustration':
                return {
                    id: this.r.int(),
                    updated_on: this.r.int(),
                    title: this.r.str(),
                    type: this.r.byte(),
                    caption: this.r.str(),
                    restrict: this.r.byte(),

                    user: this.read('User') as User,
                    tags: Array(this.r.int()).fill(this.read('Tag') as Tag),
                    tools: Array(this.r.int()).fill(this.r.str()),
                    create_date: this.r.str(),
                    width: this.r.int(),
                    height: this.r.int(),
                    sanity_level: this.r.byte(),
                    x_restrict: this.r.bool(),

                    meta_pages: Array(this.r.int()).fill(this.read('MetaPage') as MetaPage),
                    total_views: this.r.int(),
                    total_bookmarks: this.r.int(),
                    is_bookmarked: this.r.bool(),
                    visible: this.r.bool(),
                    is_muted: this.r.bool(),
                    total_comments: this.r.int(),
                } as Illustration;
            case 'MetaPage':
                return {
                    square_medium: this.r.str(),
                    medium: this.r.str(),
                    large: this.r.str(),
                    original: this.r.str(),
                } as MetaPage;
            case 'Tag':
                return {
                    name: this.r.str(),
                    translated_name: this.r.str(),
                } as Tag;
            case 'User':
                return {
                    id: this.r.int(),
                    name: this.r.str(),
                    account: this.r.str(),
                    profile_image_urls: this.r.str(),
                    is_followed: this.r.bool(),
                } as User;
            default:
                throw Error(`'${type}' is not a recognised type`);
        }
    }
}
