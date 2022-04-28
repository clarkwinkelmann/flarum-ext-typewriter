<?php

namespace ClarkWinkelmann\Typewriter;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\User())
        ->registerPreference('muteTypewriter', 'boolval', false),

    (new Extend\Settings())
        ->serializeToForum('typewriterDefaultFile', 'typewriter.defaultFile')
        ->serializeToForum('typewriterSounds', 'typewriter.sounds', function ($value) {
            $json = json_decode($value);

            return is_array($json) ? $json : [];
        }),
];
