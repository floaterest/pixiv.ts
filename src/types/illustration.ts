import { Artwork } from './pixiv-object';

export type Illustration = Artwork & {
	// date of the last successful HTTP request (when visible is true)
	updated_on: number
	type: 'illust' | 'manga' | 'ugoira'
	// image_urls (included in 'meta_pages')
	tools: string[]
	width: number
	height: number
	sanity_level: number // kinda represents how NSFW the illustration is?
	meta_pages: {
		square_medium: string
		medium: string
		large: string
		original: string
	}
	series: null // never saw a non-null value
	total_comments: number | null // DNE when getting user bookmarks
}
