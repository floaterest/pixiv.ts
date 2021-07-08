# pixiv-typed <!-- omit in toc -->
An npm module for [Pixiv](https://www.pixiv.net/en/) written in TypeScript
# Table of Contents
- [Installation](#installation)
- [Usage](#usage)
	- [PixivApi](#pixivapi)
- [Todo](#todo)
- [Contribution](#contribution)

# Installation
[Back to top](#table-of-contents)

To install, use
```sh
npm i pixiv-typed
```
To uninstall, use
```sh
npm r pixiv-typed
```

# Usage
## PixivApi
[Back to top](#table-of-contents)
> Currently, `PixivApi.login` is disabled, please use `PixivApi.refresh()` instead (for more information, see [#1](../../issues/1))

```ts
import { PixivApi } from 'pixiv-typed';

let refreshToken = 'refresh token here';

PixivApi.refresh(refreshToken).then(api => {
	//#region user
	let pixivStaff = 11;

	// api.getUserDetail() for yourself
	api.getUserDetail(pixivStaff).then(detail => {
		// do stuff with 'detail' see doc for more info
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

*For more information, please refer to the [documentation](/doc/api.md)*

# Todo
[Back to top](#table-of-contents)
- Finish PixivApi
- Add PixivDatabase

# Contribution
[Back to top](#table-of-contents)
1. Fork it [here](../../fork)
2. Create your feature branch<br>```git checkout -b feature/foobar```
3. Commit your changes<br>```git commit -am 'add foobar'```
4. Push to the branch<br>```git push origin feature/foobar```
5. Create a new Pull Request