import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true, // 将源码打成asar包
        // macOS对代码进行签名
        // osxSign: {},
        // // ...
        // osxNotarize: {
        //     // tool: 'notarytool',
        //     appleId: process.env.APPLE_ID as string,
        //     appleIdPassword: process.env.APPLE_PASSWORD as string,
        //     teamId: process.env.APPLE_TEAM_ID as string,
        // },
        // // ...
    },
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({
            // Windows对代码进行签名
            // certificateFile: './cert.pfx',
            // certificatePassword: process.env.CERTIFICATE_PASSWORD,
        }),
        new MakerZIP({}, ['darwin', 'win32']),
        new MakerRpm({}),
        new MakerDeb({}),
    ],
    plugins: [
        new VitePlugin({
            // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
            // If you are familiar with Vite configuration, it will look really familiar.
            build: [
                {
                    // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
                    entry: 'src/main/main.ts',
                    config: 'vite.main.config.ts',
                },
                {
                    entry: 'src/preload/preload.ts',
                    config: 'vite.preload.config.ts',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
        {
            // 将源码打成asar包的插件
            name: '@electron-forge/plugin-auto-unpack-natives',
            config: {},
        },
    ],
};

export default config;
