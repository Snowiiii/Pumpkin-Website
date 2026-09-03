import { defineConfig } from "vitepress";
export const zhTW = defineConfig({
lang: "zh-TW",
description: "以 Rust 編寫的高效能 Minecraft 伺服器軟體",
themeConfig: {
     // https://vitepress.dev/reference/default-theme-config
     search: {
         provider: "local",
     },
     nav: [
         {
             text: "首頁",
             link: "https://pumpkinmc.org/",
         },
     ],
     sidebar: [
         {
             text: "關於",
             items: [
                 { text: "效能評測", link: "/about/benchmarks" },
                 { text: "協助與贊助", link: "/about/helping" },
             ],
         },
         {
             text: "系統管理",
             items: [
                 { text: "總覽", link: "/admin/introduction" },
                 { text: "從 Bukkit 遷移", link: "/admin/migrating-from-bukkit" },
             ],
         },
         {
             text: "設定",
             items: [
                 { text: "簡介", link: "/config/introduction" },
                 { text: "基本", link: "/config/basic" },
                 { text: "Proxy", link: "/config/proxy" },
                 { text: "驗證", link: "/config/authentication" },
                 { text: "壓縮", link: "/config/compression" },
                 { text: "資源包", link: "/config/resource-pack" },
                 { text: "指令", link: "/config/commands" },
                 { text: "RCON", link: "/config/rcon" },
                 { text: "PVP", link: "/config/pvp" },
                 { text: "紀錄", link: "/config/logging" },
                 { text: "Query", link: "/config/query" },
                 { text: "區域網路廣播", link: "/config/lan-broadcast" },
             ],
         },
         {
             text: "開發者",
             items: [
                 { text: "貢獻", link: "/developer/contributing" },
                 { text: "簡介", link: "/developer/introduction" },
                 {
                     text: "網路",
                     link: "/developer/networking/networking",
                     items: [
                         {
                             text: "驗證",
                             link: "/developer/networking/authentication",
                         },
                         {
                             text: "RCON",
                             link: "/developer/networking/rcon",
                         },
                     ],
                 },
                 { text: "世界", link: "/developer/world" },
                 { text: "行動裝置開發", link: "/developer/mobile" },
             ],
         },
         {
             text: "外掛開發",
             items: [
                 {
                     text: "簡介",
                     link: "/plugin-dev/introduction",
                 },
                 {
                     text: "從 Bukkit 遷移",
                     collapsed: false,
                     items: [
                         {
                             text: "總覽",
                             link: "/plugin-dev/migrating-from-bukkit/",
                         },
                         {
                             text: "指令",
                             link: "/plugin-dev/migrating-from-bukkit/commands",
                         },
                         {
                             text: "事件",
                             link: "/plugin-dev/migrating-from-bukkit/events",
                         },
                         {
                             text: "物品欄與 GUI",
                             link: "/plugin-dev/migrating-from-bukkit/inventories",
                         },
                         {
                             text: "設定與資料",
                             link: "/plugin-dev/migrating-from-bukkit/configuration",
                         },
                     ],
                 },
                 {
                     text: "Rust",
                     collapsed: false,
                     items: [
                         {
                             text: "建立專案",
                             link: "/plugin-dev/rust/creating-project",
                         },
                         {
                             text: "基本邏輯",
                             link: "/plugin-dev/rust/basic-logic",
                         },
                         {
                             text: "事件",
                             link: "/plugin-dev/rust/events",
                         },
                         {
                             text: "指令",
                             items: [
                                 {
                                     text: "第一個指令",
                                     link: "/plugin-dev/rust/command/first-command",
                                 },
                                 {
                                     text: "剪刀石頭布",
                                     link: "/plugin-dev/rust/command/rock-paper-scissors",
                                 },
                             ],
                         },
                         {
                             text: "授權與更新",
                             link: "/plugin-dev/rust/plugin-utils",
                         },
                     ],
                 },
                 {
                     text: "Python",
                     collapsed: false,
                     items: [
                         {
                             text: "快速入門",
                             link: "/plugin-dev/python/quick-start",
                         },
                         {
                             text: "基本邏輯",
                             link: "/plugin-dev/python/basic-logic",
                         },
                         {
                             text: "第一個指令",
                             link: "/plugin-dev/python/first-command",
                         },
                         {
                             text: "事件",
                             link: "/plugin-dev/python/events",
                         },
                     ],
                 },
                 {
                     text: "C#",
                     collapsed: false,
                     items: [
                         {
                             text: "快速入門",
                             link: "/plugin-dev/csharp/quick-start",
                         },
                         {
                             text: "第一個指令",
                             link: "/plugin-dev/csharp/first-command",
                         },
                     ],
                 },
                 {
                     text: "C",
                     collapsed: false,
                     items: [
                         {
                             text: "快速入門",
                             link: "/plugin-dev/c/quick-start",
                         },
                         {
                             text: "第一個指令",
                             link: "/plugin-dev/c/first-command",
                         },
                     ],
                 },
                 {
                     text: "Go",
                     collapsed: false,
                     items: [
                         {
                             text: "快速入門",
                             link: "/plugin-dev/go/quick-start",
                         },
                         {
                             text: "基本邏輯",
                             link: "/plugin-dev/go/basic-logic",
                         },
                         {
                             text: "第一個指令",
                             link: "/plugin-dev/go/first-command",
                         },
                     ],
                 },
                 {
                     text: "Kotlin",
                     collapsed: false,
                     items: [
                         {
                             text: "快速入門",
                             link: "/plugin-dev/kotlin/quick-start",
                         },
                         {
                             text: "第一個指令",
                             link: "/plugin-dev/kotlin/first-command",
                         },
                     ],
                 },
             ],
         },
         {
             text: "疑難排解",
             items: [
                 {
                     text: "常見問題",
                     link: "/troubleshooting/common_issues.md",
                 },
             ],
         },
     ],
     socialLinks: [
         { icon: "github", link: "https://github.com/Pumpkin-MC/Pumpkin" },
         { icon: "discord", link: "https://discord.gg/RNm224ZsDq" },
     ],
     logo: "/assets/favicon.ico",
     footer: {
         message: "以 MIT 授權釋出。",
         copyright: `版權所有 © 2024-${new Date().getFullYear()} Aleksandr Medvedev`,
     },
     editLink: {
         pattern:
             "https://github.com/Pumpkin-MC/Pumpkin-Docs/blob/master/docs/:path",
         text: "在 GitHub 上編輯此頁面",
     },
     lastUpdated: {
         text: "更新於",
         formatOptions: {
             dateStyle: "medium",
             timeStyle: "medium",
         },
     },
     outline: "deep",
 },
});