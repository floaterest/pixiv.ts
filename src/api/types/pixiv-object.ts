import { User } from './user';

enum Restrict{
	Public,
	MypixivOnly,
	Private,
}

export type PageCallback<T extends PixivPage> = (page: T) => boolean;

export interface PixivPage{
	next_url: string | null
}

export interface Artwork{
	id: number
	title: number
	caption: string
	restrict: Restrict
	x_restrict: boolean // true if r18
	create_date: string // iso
	tags: {
		name: string
		translated_name: string | null
	}
	user: User
	total_view: number
	total_bookmarks: number
	is_bookmarked: boolean
	visible: boolean
	is_muted: boolean
}
