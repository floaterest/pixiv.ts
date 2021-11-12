# PixivApi <!-- omit in toc -->
Promise based API wrapper for [Pixiv](https://www.pixiv.net/) including typings
- for source code, see [here](../src/api/pixiv-api.ts)
- for code usages, see [readme](../README.md)
- for interfaces, see [this directory](../src/api/types)

<!-- omit in toc -->
# Table of Contents 
- [Getting Started](#getting-started)
- [OAuth](#oauth)
    - [Login](#login)
    - [Refresh](#refresh)
- [User](#user)
    - [User Detail](#user-detail)
    - [User Illustrations](#user-illustrations)
    - [User Bookmarks](#user-bookmarks)
    - [User Following](#user-following)
- [Illustration](#illustration)
    - [Illustration Detail](#illustration-detail)
    - [Add Bookmark](#add-bookmark)
    - [Delete Bookmark](#delete-bookmark)
- [Download Illustration](#download-illustration)

# Getting Started
[Back to top](#table-of-contents)

> Currently, `PixivApi.login` is disabled, please use `PixivApi.refresh()` instead (for more information, see [#1](../../issues/1))

Pixiv uses **access token** as bearer authorization for each HTTP request. The access token can be obtained using a **refresh token** ~~or **email/username and password**~~
- login with email and password will cause Pixiv to send an email saying
    > [pixiv] 新しいログインがありました (場所: {country})<br>
    > [pixiv] New login to pixiv from {country} 
- To avoid this, simply login with refresh token that can be obtained by:
```ts
PixivApi.login('email','password').then(api => console.log(api.token.refresh_token));
```

# OAuth
> Get/Refresh the access token and create a `PixivApi` instance

## Login
[Back to top](#table-of-contents)
```ts
static async login(email: string, password: string): Promise<PixivApi>
```
- Parameters
    - `email`: user email or username
    - `password`: user password
- Returns
    - a promised `PixivApi` instance that can be used to perform all other HTTP requests
- Note
    - Pixiv will send an email saying new login, so use this only to get the refresh token

## Refresh
[Back to top](#table-of-contents)
```ts
static async refresh(refreshToken: string): Promise<PixivApi>
```
- Parameters
    - `refreshToken`: user's refresh token (do not share it because it never expires!)
- Returns
    - a promised `PixivApi` instance that can be used to perform all other HTTP requests
- Note
    - Pixiv won't send email if user logs in with refresh token

# User
> Perform HTTP requests to `/v1/user/*`

## User Detail
[Back to top](#table-of-contents)
```ts
async getUserDetail(id: number = this.uid): Promise<UserDetail>
```
- GET `/v1/user/detail`
    - Parameters
        - `id`: user's id (or user id from the token by default)
    - Returns
        - a promised `UserDetail` object, see [UserDetail interface](../src/api/types/user.ts) for more information

## User Illustrations
[Back to top](#table-of-contents)
```ts
async getUserIllusts(callback: (page: IllustsPage) => boolean, id: number = this.uid)
```
- GET `/v1/user/illusts`
    - Parameters
        - `callback`: if callback returns `true`, the API will continue requesting the next page
        - `id`: user's id (or user id from the token by default)
    - Returns
        - nothing because the result is processed in `callback`
    - Note
        - see [IllustsPage interface](../src/api/types/user.ts) for more information (but there's almost nothing there, so see [Illustration interface](../src/api/types/illustration.ts) for more details)

## User Bookmarks
[Back to top](#table-of-contents)
```ts
async getUserBookmarks(callback: (page: IllustsPage) => boolean, id: number = this.uid, restrict: 'public' | 'private' = 'public')
```
- GET `/v1/user/bookmarks/illust`
    - Parameters
        - `callback`: if callback returns `true`, the API will continue requesting the next page
        - `restrict`: public or private (don't request other people's private bookmarks)
    - Returns
        - nothing because the result is processed in `callback`
    - Notes
        - see [IllustsPage interface](../src/api/types/user.ts) and [Illustration interface](../src/api/types/illustration.ts) for more details
## User Following
[Back to top](#table-of-contents)
```ts
async getUserFollowing(callback: callback: (page: UsersPage) => boolean, id: number = this.uid, restrict: 'public' | 'private' = 'public')
```
- GET `/v1/user/following`
    - Parameters
        - `callback`: if callback returns `true`, the API will continue requesting the next page
        - `id`: user id, or token's user id by default
        - `restrict`: public or private
    - Returns
        - nothing because the resut is processed in `callback`
    - Notes
        - see [UsersPage and UserPreview interface](../src/api/types/user.ts) for more details


# Illustration
> Perform HTTP requests to `/v1/illust/*`

## Illustration Detail
[Back to top](#table-of-contents)
```ts
async getIllustDetail(id: number): Promise<Illustration>
```
- GET `/v1/illust/detail`
    - Parameters
        - `id`: illustration id
    - Returns
        - a promised `Illustration` object, see [Illustration interface](../src/api/types/illustration.ts) and [Artwork interface](../src/api/types/pixiv-object.ts) for more information

## Add Bookmark
[Back to top](#table-of-contents)
```ts
async addBookmark(id: number, restrict: 'public' | 'private' = 'public')
```
- POST `/v2/illust/bookmark/add`
    - Parameters
        - `id`: illustration id
        - `restrict`: public or private
    - Returns
        - a promised absolutely nothing

## Delete Bookmark
[Back to top](#table-of-contents)
```ts
async deleteBookmark(id: number, restrict: 'public' | 'private' = 'public')
```
- POST `v1/illust/bookmark/delete`
    - Parameters
        - `id`: illustration id
        - `restrict`: public or private
    - Returns
        - a promised void

# Download Illustration
[Back to top](#table-of-contents)
```ts
static async download(url: string, dest = path.basename(url), override = false)
```
- Parameters
    - `url`: image url, see [readme](../README.md#pixivapi) for how to get it
    - `dest`: destination file name, extension can be omitted
    - `override`: throws error if `false` and file already exists
- Notes
    - this method is static, therefore no need to login