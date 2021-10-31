# PixivApi <!-- omit in toc -->
Promise based API wrapper for [Pixiv](https://www.pixiv.net/) including typings
- for source code, see [here](../src/api/pixiv-api.ts)
- for code usages, see [readme](../README.md)

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
- [Illustration](#illustration)
    - [Illustration Detail](#illustration-detail)

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
[Back to top](#table-of-contents)

Get/Refresh the access token and create a `PixivApi` instance

## Login
```ts
static async login(email: string, password: string): Promise<PixivApi>
```
- [Source code](../../331f70d9c2e56964d89ccbbb267753c85c19a019/src/api/pixiv-api.ts#L92)
    - Parameters
        - `email` user email or username
        - `password` user password
    - Returns
        - a promised `PixivApi` instance that can be used to perform all other HTTP requests
    - Note
        - Pixiv will send an email saying new login, so use this only to get the refresh token

## Refresh
```ts
static async refresh(refreshToken: string): Promise<PixivApi>
```
- [Source code](../../331f70d9c2e56964d89ccbbb267753c85c19a019/src/api/pixiv-api.ts#L107)
    - Parameters
        - `refreshToken` user's refresh token (do not share it because it never expires!)
    - Returns
        - a promised `PixivApi` instance that can be used to perform all other HTTP requests
    - Note
        - Pixiv won't send email if user logs in with refresh token

# User
Perform HTTP requests to `/v1/user/*`

## User Detail
```ts
async getUserDetail(id: number = this.token.user.id): Promise<UserDetail>
```
- GET `/v1/user/detail` ([source code](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/pixiv-api.ts#L120))
    - Parameters
        - `id` user's id (or user id from the token by default)
    - Returns
        - a promised `UserDetail` object, see [UserDetail interface](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/types/user.ts#L15) for more information

## User Illustrations
```ts
async getUserIllusts(callback: (page: IllustsPage) => boolean, id: number = this.token.user.id)
```
- GET `/v1/user/illusts` ([source code](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/pixiv-api.ts#L126))
    - Parameters
        - `callback` a function that processes the result from the HTTP request
        - `id` user's id (or user id from the token by default)
    - Returns
        - nothing because the result is processed in `callback`
    - Note
        - if `callback` returns `true`, the API will continue requesting the next page
        - see [IllustsPage interface](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/types/user.ts#L69) for more information (but there's almost nothing there, so see [Illustration interface](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/types/illustration.ts#L3) for more details)

## User Bookmarks
```ts
async getUserBookmarks(callback, id: number = this.token.user.id, restrict: 'public' | 'private' = 'public')
```
- GET `/v1/user/bookmarks/illust` ([source code](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/pixiv-api.ts#L132))
    - Parameters
        - same as  [User Illustrations](#user-illustrations)
        - `restrict` public or private (don't request other people's private bookmarks)
    - Returns
        - nothing because the result is processed in `callback`

# Illustration
Perform HTTP requests to `/v1/illust/*`

## Illustration Detail
```ts
async getIllustDetail(id: number): Promise<Illustration>
```
- GET `/v1/illust/detail` ([source code](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/pixiv-api.ts#L147))
    - Parameters
        - `id` illustration id
    - Returns
        - a promised `Illustration` object, see [Illustration interface](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/types/illustration.ts#L3) and [Artwork interface](../../14f3065a0bb8d83fc49ea6c52c8a5c1b05d3e66e/src/api/types/pixiv-object.ts#L13) for more information
