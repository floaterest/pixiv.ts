# pixiv-typed <!-- omit in toc -->
An npm module for [Pixiv](https://www.pixiv.net/en/) written in TypeScript

<!-- omit in toc -->

# Table of Contents
- [Table of Contents](#table-of-contents)
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
<details>
<summary><b>Code Example</b></summary>

```ts
import { PixivApi } from 'pixiv-typed';

let refreshToken = 'refresh token here';

PixivApi.refresh(refreshToken).then(async api => {
  //#region user
  let pixivStaff = 11;

  // api.getUserDetail() for yourself
      // do stuff with 'detail' see doc for more info
  let detail = await api.getUserDetail(pixivStaff)

  await api.getUserIllusts(page => {
      // this will request all pages
      // return false to stop requesting
      return true;
  }, pixivStaff);

  await api.getUserBookmarks(page => {
      // only look for private bookmarks for yourself
      return true;
  }, pixivStaff, 'public');

  //#endregion user

  //#region illustration

  let pixivAnniversary = 1580459;
  let illust = api.getIllustDetail(pixivAnniversary);
  //#endregion illustration
});

```
</details>

*For more information, please refer to the [documentation](/doc/api.md)*

# Todo
[Back to top](#table-of-contents)
- PixivApi
  - user
    - add other artwork type to getUserBookmarks
    - add getUserFollowings
    - add novels in UserPreview interface
  - illust
    - add add/delete bookmark
  - general
    - add "too many requests" handler support
    - add file downloader and filename formatter
- PixivDatabase
  - add database structure
  - add read/write support

# Contribution
[Back to top](#table-of-contents)
1. Fork it [here](../../fork)
2. Create your feature branch<br>```git checkout -b feature/foobar```
3. Commit your changes<br>```git commit -am 'add foobar'```
4. Push to the branch<br>```git push origin feature/foobar```
5. Create a new Pull Request
