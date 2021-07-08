# pixiv-typed
A typed module for [Pixiv](https://www.pixiv.net/en/) written in TypeScript

## Features
### PixivApi
> Currently, `PixivApi.login` is disabled, please use `PixivApi.refresh()' instead

```ts
import { PixivApi } from 'pixiv-typed';

let refreshToken = 'refresh token here';

PixivApi.refresh(refreshToken).then(api => {
	//#region user
	let pixivStaff = 11;

	// api.getUserDetail() for yourself
	api.getUserDetail(pixivStaff).then(detail => {
		// do stuff with 'detail' see wiki for more info
	});

	api.getUserIllusts(page => {
		// this will request all pages
		// return false to stop requesting
		return true;
	}, pixivStaff).then();

	api.getUserBookmarks(page => {
		// only look for private bookmarks for yourself
		return true;
	}, pixivStaff, 'public').then();

	//#endregion user

	//#region illustration
	
	let pixivAnniversary = 1580459;
	api.getIllustDetail(pixivAnniversary).then(illust => {
		// do stuff with 'illust'
	});
	//#endregion illustration
});

```
## TODO
- Pixiv database
