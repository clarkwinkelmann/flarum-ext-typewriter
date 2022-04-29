import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

const settingsPrefix = 'typewriter.';
const translationPrefix = 'clarkwinkelmann-typewriter.admin.settings.';

interface Sound {
    keys: string
    file: string
}

app.initializers.add('typewriter', () => {
    app.extensionData
        .for('clarkwinkelmann-typewriter')
        .registerSetting({
            setting: settingsPrefix + 'muteByDefault',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'muteByDefault'),
        })
        .registerSetting({
            setting: settingsPrefix + 'showIntroductionPopup',
            type: 'switch',
            label: app.translator.trans(translationPrefix + 'showIntroductionPopup'),
        })
        .registerSetting({
            setting: settingsPrefix + 'defaultFile',
            type: 'text',
            label: app.translator.trans(translationPrefix + 'defaultFile'),
        })
        .registerSetting(function (this: ExtensionPage) {
            let sounds: Sound[];

            try {
                sounds = JSON.parse(this.setting(settingsPrefix + 'sounds')());
            } catch (e) {
                // do nothing, we'll reset to something usable
            }

            // @ts-ignore variable used before assignment, it's fine
            if (!Array.isArray(sounds)) {
                sounds = [{
                    keys: '',
                    file: '',
                }];
            }

            return m('.Form-group', [
                m('label', app.translator.trans(translationPrefix + 'sounds')),
                m('table', [
                    m('thead', m('tr', [
                        m('th', app.translator.trans(translationPrefix + 'head.keys')),
                        m('th', app.translator.trans(translationPrefix + 'head.file')),
                        m('th'),
                    ])),
                    m('tbody', [
                        sounds.map((sound, index) => m('tr', [
                            m('td', m('input.FormControl', {
                                type: 'text',
                                value: sound.keys || '',
                                onchange: (event: InputEvent) => {
                                    sound.keys = (event.target as HTMLInputElement).value;
                                    this.setting(settingsPrefix + 'sounds')(JSON.stringify(sounds));
                                },
                            })),
                            m('td', m('input.FormControl', {
                                type: 'text',
                                value: sound.file || '',
                                onchange: (event: InputEvent) => {
                                    sound.file = (event.target as HTMLInputElement).value;
                                    this.setting(settingsPrefix + 'sounds')(JSON.stringify(sounds));
                                },
                            })),
                            m('td', Button.component({
                                className: 'Button Button--icon',
                                icon: 'fas fa-times',
                                onclick: () => {
                                    sounds.splice(index, 1);

                                    this.setting(settingsPrefix + 'sounds')(JSON.stringify(sounds));
                                },
                            })),
                        ])),
                        m('tr', m('td', {
                            colspan: 3,
                        }, Button.component({
                            className: 'Button Button--block',
                            onclick: () => {
                                sounds.push({
                                    keys: '',
                                    file: '',
                                });

                                this.setting(settingsPrefix + 'sounds')(JSON.stringify(sounds));
                            },
                        }, app.translator.trans(translationPrefix + 'add'))))
                    ]),
                ]),
            ]);
        });
});
