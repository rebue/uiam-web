import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';

// function ignoreFunction(path: string) {
//     console.log(path);
//     return false;
// }

const config: ForgeConfig = {
    packagerConfig: {
        // 将源码打成asar包(依赖了@electron-forge/plugin-auto-unpack-natives插件)
        // asar: true,
        // ignore: [/^(?!node_module)s$/],
        // ignore: [/^\/(?!.*node_modules)$/g],
        ignore: (path) => {
            console.log('ignore path', path);
            if (!path) return false;
            return (
                !/^[/\\]package\.json$/.test(path) &&
                // !/^[/\\]node_modules/.test(path) &&
                // !/^[/\\]node_modules($|[/\\]).*$/.test(path) &&
                !/^[/\\]\.vite($|[/\\]).*$/.test(path)
            );
        },
        // ignore: ['^/\\.vite$\\/'],
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
        // {
        //     // 将源码打成asar包的插件
        //     name: '@electron-forge/plugin-auto-unpack-natives',
        //     config: {},
        // },
    ],
};

export default config;
