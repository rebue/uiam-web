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
        asar: true, // 目前Electron-Forge的7.2.0版本有bug，不能打包比较大的包(https://github.com/electron/forge/pull/3336)
        ignore: [
            /^[/\\]\.key$/,
            /^[/\\]out$/,
            /^[/\\]src$/,
            /^[/\\]\.env\.development$/,
            /^[/\\]\.env\.production$/,
            /^[/\\]\.eslintrc\.json$/,
            /^[/\\]\.gitignore$/,
            /^[/\\]\.npmrc$/,
            /^[/\\]\.prettierrc\.yml$/,
            /^[/\\]forge\.config\.ts$/,
            /^[/\\]README\.adoc$/,
            /^[/\\]tsconfig\.json$/,
            /^[/\\]vite\.main\.config\.ts$/,
            /^[/\\]vite\.preload\.config\.ts$/,
            /^[/\\]vite\.renderer\.config\.ts$/,
            /^[/\\]yarn-error\.log$/,
            /^[/\\]yarn\.lock$/,
        ],
        // // 使用函数这种灵活的方式来忽略(目前Electron-Forge的7.2.0版本有bug，打包node_modules下的某些模块会报错https://github.com/electron/forge/pull/3336)
        // ignore: (path) => {
        //     console.log('ignore path', path);
        //     if (!path) return false;
        //     return !/^[/\\]package\.json$/.test(path) && !/^[/\\]\.vite($|[/\\]).*$/.test(path);
        // },
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
        {
            // Windows对代码进行签名
            name: '@electron-forge/maker-squirrel',
            config: {
                certificateFile: './.key/uiam-web.pfx',
                certificatePassword: process.env.CERTIFICATE_PASSWORD,
            },
        },
        {
            name: '@electron-forge/maker-zip',
            config: {
                // Config here
            },
        },
        {
            name: '@electron-forge/maker-dmg',
            config: {
                // background: './assets/dmg-background.png',
                // format: 'ULFO',
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'rebue',
                    name: 'uiam-web',
                },
                // prerelease: true,
                // draft: false,
                // force: true,
            },
        },
        // {
        //     name: '@electron-forge/publisher-electron-release-server',
        //     config: {
        //         baseUrl: 'http://fq:18081',
        //         username: 'username',
        //         password: process.env.ELECTRON_RELEASE_SERVER_PASSWORD,
        //     },
        // },
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
