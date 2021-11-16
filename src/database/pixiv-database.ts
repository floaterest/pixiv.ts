import fs from 'fs';

import { BinaryReader } from './io';
import { Restrict } from '../api/types/pixiv-object';

export enum IllustType{
    illust,
    manga,
    ugoira
}

export interface User{
    id: number
    name: string
    account: string
    /**
     * same as profile_image_urls.medium in HTTP response
     */
    profile_image_urls: string
    is_followed: boolean
}

export interface Tag{
    name: string,
    translated_name: string
}

export interface MetaPage{
    square_medium: string
    medium: string
    large: string
    original: string
}

export interface Illustration{
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
    path!: string;
    lastModified!: number;
    username!: string;
    illustrations!: Illustration[];

    //#endregion properties

    private constructor(){}

    private static read(
        r: BinaryReader,
        type: 'Illustration' | 'MetaPage' | 'Tag' | 'User',
    ): Illustration | MetaPage | Tag | User{
        switch(type){
            case 'Illustration':
                return {
                    id: r.int(),
                    updated_on: r.int(),
                    title: r.str(),
                    type: r.byte(),
                    caption: r.str(),
                    restrict: r.byte(),

                    user: PixivDatabase.read(r, 'User') as User,
                    tags: Array(r.int()).fill(PixivDatabase.read(r, 'Tag') as Tag),
                    tools: Array(r.int()).fill(r.str()),
                    create_date: r.str(),
                    width: r.int(),
                    height: r.int(),
                    sanity_level: r.byte(),
                    x_restrict: r.bool(),

                    meta_pages: Array(r.int()).fill(PixivDatabase.read(r, 'MetaPage') as MetaPage),
                    total_views: r.int(),
                    total_bookmarks: r.int(),
                    is_bookmarked: r.bool(),
                    visible: r.bool(),
                    is_muted: r.bool(),
                    total_comments: r.int(),
                } as Illustration;
            case 'MetaPage':
                return {
                    square_medium: r.str(),
                    medium: r.str(),
                    large: r.str(),
                    original: r.str(),
                } as MetaPage;
            case 'Tag':
                return {
                    name: r.str(),
                    translated_name: r.str(),
                } as Tag;
            case 'User':
                return {
                    id: r.int(),
                    name: r.str(),
                    account: r.str(),
                    profile_image_urls: r.str(),
                    is_followed: r.bool(),
                } as User;
            default:
                throw Error(`'${type}' is not a recognised type`);
        }
    }

    static async fromFile(path: string): Promise<PixivDatabase>{
        let d = new PixivDatabase();
        d.path = path;
        await fs.readFile(path, (err, data) => {
            if(err) throw err;

            let r = new BinaryReader(data);
            d.lastModified = r.int();
            d.username = r.str();
            d.illustrations = Array(r.int()).fill(PixivDatabase.read(r, 'Illustration'));
        });
        return d;
    }
}
