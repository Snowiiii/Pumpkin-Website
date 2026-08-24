import { defineConfig } from "vitepress";
import { en } from "./en";
import { nl } from "./nl";
import { pt } from "./pt";
import { zhCN } from "./zh_cn";
import { de } from "./de";
import { trTR } from "./tr_tr";
import { jaJP } from "./ja_jp";
import { fr } from "./fr";


// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Pumpkin",

    // Uncomment this line to work into a GitHub page
    base: "/Pumpkin-Docs/",

    cleanUrls: true,
    rewrites: {
        'en/:rest*': ':rest*'
    },

    locales: {
        root: {
            label: "English", ...en
        },
        nl: {
            label: "Dutch", ...nl
        },
        pt: {
            label: "Português", ...pt
        },
        zh_cn: {
            label: "简体中文", ...zhCN
        },
        de: {
            label: "Deutsch", ...de
        },
        tr_TR: {
            label: "Türkçe", ...trTR
        },
        ja_jp: {
            label: "日本語", ...jaJP
        },
        fr: {
            label: "Français", ...fr
        },
    },

    head: [
        ["link", { rel: "shortcut icon", href: "/assets/favicon.ico" }],
        ["link", { rel: "icon", type: "image/png", href: "/assets/favicon-96x96.png", sizes: "96x96" }],
        ["link", { rel: "icon", type: "image/svg+xml", href: "/assets/favicon.svg" }],
        ["link", { rel: "apple-touch-icon", href: "/assets/apple-touch-icon.png", sizes: "180x180" }],
        ["link", { rel: "manifest", href: "/assets/site.webmanifest" }],

        ["link", { rel: "canonical", href: "https://pumpkinmc.org/" }],

        ["meta", { name: "apple-mobile-web-app-title", content: "Pumpkin" }],

        ["script", { async: '', src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" }],
        ['script', {}, `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-QK7NXQQ2ZP');`]

    ],
});
