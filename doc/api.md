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
[source code](../src/api/pixiv-api.ts#L92)
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
- Parameters
    - `refreshToken` user's refresh token (do not share it because it never expires!)
- Returns
    - a promised `PixivApi` instance that can be used to perform all other HTTP requests
- Note
    - <abbr title="so (ab)use this, not login">Pixiv won't send email if user logs in with refresh token</abbr>
