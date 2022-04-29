# Typewriter Sounds

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-typewriter/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-typewriter.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-typewriter) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-typewriter.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-typewriter) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

This extension plays custom sounds while the user types in the Flarum reply composer.

A mute button is available in the top right of the composer.
The mute setting is saved to the user profile, so it persists across sessions and browsers.

No sounds are embedded in the extension, you have to provide your own.

Format for the settings:

- **File**: an absolute URL to a media file. You can skip the domain if hosted locally. For example: `/assets/typewriter/keystroke.mp3` or `https://cdn.mysite.tld/sound.ogg`.
- **Keys**: a regular expression to match a valid [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) value. This expression will be passed to the constructor of javascript's `RegExp` so it does not need delimiters. If you are only matching one key, you can generally just enter the character in the field. To match multiple characters, use `[abc]` or `[a-c]`. Enter is `Enter`.

## Installation

    composer require clarkwinkelmann/flarum-ext-typewriter

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

**Sponsors**: [Billy Wilcosky (`@010101`)](https://www.wilcosky.com/)

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-typewriter)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-typewriter)
- [Discuss](https://discuss.flarum.org/d/30720)
