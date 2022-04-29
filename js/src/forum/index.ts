import app from 'flarum/forum/app';
import {extend} from 'flarum/common/extend';
import Button from 'flarum/common/components/Button';
import Tooltip from 'flarum/common/components/Tooltip';
import Composer from 'flarum/forum/components/Composer';
import ComposerBody from 'flarum/forum/components/ComposerBody';
import ComposerButton from 'flarum/forum/components/ComposerButton';

let showIntroductionPopup = window.localStorage.getItem('hideTypewriterIntroductionPopup') === '1' ? false : null;

interface Sound {
    keys?: string
    regex?: RegExp
    file?: string
}

const loadedFiles: {
    [key: string]: HTMLAudioElement
} = {};

function isMuted(): boolean {
    const preferenceValue = app.session.user?.preferences().muteTypewriter;

    return preferenceValue === null ? app.forum.attribute('typewriterMuteByDefault') : preferenceValue;
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
    if (showIntroductionPopup === null && app.forum.attribute('typewriterShowPopup')) {
        showIntroductionPopup = true;
        m.redraw();
    }

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

        const preferenceValue = app.session.user.preferences().muteTypewriter;
        const muted = preferenceValue === null ? app.forum.attribute('typewriterMuteByDefault') : preferenceValue;

        items.add('typewriter', m('span.TypeWriterButtonWrapper', [
            Tooltip.component({
                text: app.translator.trans('clarkwinkelmann-typewriter.forum.' + (muted ? 'enable' : 'mute')),
            }, ComposerButton.component({
                icon: 'typewriter-mute fas fa-' + (muted ? 'volume-mute' : 'volume-up'),
                onclick: () => {
                    showIntroductionPopup = false;
                    this.muteTypewriterLoading = true;

                    app.session.user.savePreferences({muteTypewriter: !muted}).then(() => {
                        this.muteTypewriterLoading = false;
                        m.redraw();

                        loadFiles();
                    });
                },
                loading: this.muteTypewriterLoading,
            })),
            showIntroductionPopup ? m('.TypeWriterIntroductionPopup', [
                app.translator.trans('clarkwinkelmann-typewriter.forum.introductionMessage'),
                Button.component({
                    'aria-label': app.translator.trans('core.lib.alert.dismiss_a11y_label'),
                    icon: 'fas fa-times',
                    class: 'Button Button--link Button--icon',
                    onclick() {
                        showIntroductionPopup = false;
                        window.localStorage.setItem('hideTypewriterIntroductionPopup', '1');
                    },
                }),
            ]) : null,
        ]), 10);
    });

    extend(ComposerBody.prototype, 'oncreate', function () {
        loadFiles();

        // If the user already made a choice, never show the popup again
        if (app.session.user?.preferences().muteTypewriter !== null) {
            showIntroductionPopup = false;
        }

        this.element.addEventListener('keydown', composerKeyDown);
    });

    extend(ComposerBody.prototype, 'onremove', function () {
        this.element.removeEventListener('keydown', composerKeyDown);
    });
});
