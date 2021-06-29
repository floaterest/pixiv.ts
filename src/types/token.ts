import { PixivObject } from './pixiv-object';

type User = {
	profile_image_urls: ProfileImageUrls;
	id: number;
	name: string;
	account: string;
	mail_address: string;
	is_premium: boolean;
	x_restrict: number;
	is_mail_authorized: boolean;
}

type ProfileImageUrls = {
	px_16x16: string;
	px_50x50: string;
	pi_170x170: string;
}

export type Token = PixivObject & {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	refresh_token: string;
	user: User;
}
