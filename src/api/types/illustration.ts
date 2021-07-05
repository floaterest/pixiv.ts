import { Artwork } from './pixiv-object';

export interface Illustration extends Artwork{
	type: 'illust' | 'manga' | 'ugoira'
	image_urls: {
		square_medium: string
		medium: string
		large: string
	}
	tools: string[]
	width: number
	height: number
	sanity_level: number // kinda represents how NSFW the illustration is?
	series: null // never saw a non-null value
	meta_single_page: {
		original_image_url: string
	}
	meta_pages: {
		square_medium: string
		medium: string
		large: string
		original: string
	}[]
	total_comments?: number // DNE when getting user bookmarks
}
