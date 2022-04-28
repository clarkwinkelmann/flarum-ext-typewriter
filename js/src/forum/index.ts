import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Tooltip from 'flarum/common/components/Tooltip';
import Composer from 'flarum/forum/components/Composer';
import ComposerBody from 'flarum/forum/components/ComposerBody';
import ComposerButton from 'flarum/forum/components/ComposerButton';

interface Sound {
    keys?: string
    regex?: RegExp
    file?: string
}

const loadedFiles: {
    [key: string]: HTMLAudioElement
} = {};

function isMuted(): boolean {
    return app.session.user?.preferences().muteTypewriter;
}

function loadFile(file: string) {
    if (Object.keys(loadedFiles).indexOf(file) !== -1) {
        return;
    }

    loadedFiles[file] = new Audio(file);
}

function loadFiles() {
    if (isMuted()) {
        return;
    }

    let defaultFile = app.forum.attribute('typewriterDefaultFile') as string | undefined;

    if (defaultFile) {
        loadFile(defaultFile);
    }

    let sounds = app.forum.attribute('typewriterSounds') as Sound[] | undefined;

    if (Array.isArray(sounds)) {
        sounds.forEach(sound => {
            if (sound.file) {
                loadFile(sound.file);
            }

            if (sound.keys) {
                sound.regex = new RegExp(sound.keys);
            }
        });
    }
}

function playFile(file: string) {
    if (isMuted()) {
        return;
    }

    if (app.forum.attribute('debug')) {
        console.info('[typewriter] Playing ' + file);
    }

    if (Object.keys(loadedFiles).indexOf(file) === -1) {
        console.error('[typewriter] File ' + file + ' not loaded');
        return;
    }

    const sound = loadedFiles[file].cloneNode(false) as HTMLAudioElement;

    sound.play();
}

function pressedKey(key: string) {
    let sounds = app.forum.attribute('typewriterSounds') as Sound[] | undefined;

    if (Array.isArray(sounds)) {
        for (let i = 0; i < sounds.length; i++) {
            const sound = sounds[i];

            if (!sound.regex || !sound.file) {
                continue;
            }

            if (sound.regex.test(key)) {
                playFile(sound.file);
                return;
            }
        }
    }

    let defaultFile = app.forum.attribute('typewriterDefaultFile') as string | undefined;

    if (defaultFile) {
        playFile(defaultFile);
    }
}

function composerKeyDown(event: KeyboardEvent) {
    pressedKey(event.key);
}

app.initializers.add('typewriter', () => {
    extend(Composer.prototype, 'controlItems', function (items) {
        if (!app.session.user) {
            return;
        }

        const muted = app.session.user.preferences().muteTypewriter;

        items.add('typewriter', Tooltip.component({
            text: app.translator.trans('clarkwinkelmann-typewriter.forum.mute'),
        }, ComposerButton.component({
            icon: 'typewriter-mute fas fa-' + (muted ? 'volume-mute' : 'volume-up'),
            onclick: () => {
                this.muteTypewriterLoading = true;

                app.session.user.savePreferences({muteTypewriter: !muted}).then(() => {
                    this.muteTypewriterLoading = false;
                    m.redraw();

                    loadFiles();
                });
            },
            loading: this.muteTypewriterLoading,
        })), 10);
    });

    extend(ComposerBody.prototype, 'oncreate', function () {
        loadFiles();

        this.element.addEventListener('keydown', composerKeyDown);
    });

    extend(ComposerBody.prototype, 'onremove', function () {
        this.element.removeEventListener('keydown', composerKeyDown);
    });
});
