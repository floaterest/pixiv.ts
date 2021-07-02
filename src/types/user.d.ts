import { PixivObject } from './pixiv-object';

export declare type User = PixivObject & {
	id: number
	name: string
	account: string
	profile_image_urls: {
		medium: string
	}
	is_followed: boolean
	comment: string
}

export declare type UserDetail = PixivObject & {
	user: User
	profile: {
		webpage: string
		gender: string
		birth: string
		birth_day: string
		birth_year: string
		region: string
		address_id: string
		country_code: string
		job: string
		job_id: number
		total_follow_users: number
		total_mypixiv_users: number
		total_illusts: number
		total_manga: number
		total_novels: number
		total_illust_bookmarks_public: number
		total_illust_series: number
		total_novel_series: number
		background_image_url: string
		twitter_account: string
		twitter_url: string
		pawoo_url: string
		is_premium: boolean
		is_using_custom_profile_image: boolean
	}
	profilePublicity: {
		gender: 'public' | 'private'
		region: string
		birth_day: string
		birth_year: string
		job: string
		// why is just this bool?
		pawoo: boolean
	}
	workspace: {
		pc: string
		monitor: string
		tool: string
		scanner: string
		tablet: string
		mouse: string
		printer: string
		desktop: string
		music: string
		desk: string
		chair: string
		comment: string
		workspace_image_url: string
	}
}
