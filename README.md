# Pixiv.ts <!-- omit in toc -->
An [Pixiv](https://www.pixiv.net/en/) API wrapper written in TypeScript

<!-- omit in toc -->

# Table of Contents
- [Table of Contents](#table-of-contents)
- [Usage](#usage)
  - [PixivApi](#pixivapi)
- [Todo](#todo)

# Usage
## PixivApi
[Back to top](#table-of-contents)
<details>
<summary><b>Code Example</b></summary>

```ts
import { PixivApi } from 'pixiv.ts';

let refreshToken = 'refresh token here';

(async function(){
    let api = await PixivApi.refresh(refreshToken);
    //#region user
    let pixivStaff = 11;

    // api.getUserDetail() for yourself
    // do stuff with 'detail' see doc for more info
    let detail = await api.getUserDetail(pixivStaff);

    // get public illustrations
    await api.getUserIllusts(page => {
        // this will request all pages
        // return false to stop requesting
        return true;
    }, pixivStaff);

    // get your own public bookmarks
    await api.getUserBookmarks(page => {
        return true;
    });

    // get private following for yourself
    await api.getUserFollowing(page => {
        return true;
    }, null, 'private');
    //#endregion user

    //#region illustration

    let pixivAnniversary = 1580459;
    let illust = await api.getIllustDetail(pixivAnniversary);
    // add public bookmark
    await api.addBookmark(pixivAnniversary);
    // delete private bookmark
    await api.deleteBookmark(pixivAnniversary, 'private');
    //#endregion illustration

    // get original image url (this is frustrating I know)
    let url = illust.page_count == 1
        ? illust.meta_single_page.original_image_url!
        : illust.meta_pages[0].image_urls.original!;
    // download to 'anniversary' and do not throw error if overriding
    // no need to login, image extension will be automatically added
    await PixivApi.download(url,'anniversary',true);
})();
```
</details>

*For more information, please refer to the [documentation](/doc/api.md)*

# Todo
[Back to top](#table-of-contents)
- PixivApi
  - user
    - add other artwork type to getUserBookmarks
    - add novels in UserPreview interface
    - check of novel has page_count (for Artwork interface creation)
  - general
    - add "too many requests" handler support
    - add file downloader and filename formatter
- PixivDatabase
  - add database structure
  - add read/write support
  - method for convert from json (HTTP)
  - method for convert from Buffer(65536)
