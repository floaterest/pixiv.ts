import { User } from './user';

enum Restrict{
	Public,
	MypixivOnly,
	Private,
}


export type PixivObject = {}

export type PixivPage = {
	next_url: string
}

export type Artwork = PixivObject & {
	id: number
	title: number
	caption: string
	restrict: Restrict
	x_restrict: boolean // true if r18
	create_date: string // iso
	tags: {
		name: string
		translated_name: string
	}
	user: User
	total_view: number
	total_bookmarks: number
	is_bookmarked: boolean
	visible: boolean
	is_muted: boolean
}
