import { defineConfig } from "vitepress";

export const en = defineConfig({
    lang: "en-US",
    description: "A High-performance Minecraft server software written in Rust",

    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        search: {
            provider: "local",
        },
        nav: [
            {
                text: "Home",
                link: "https://pumpkinmc.org/",
            },
        ],
        sidebar: [
            {
                text: "About",
                items: [
                    { text: "Benchmarks", link: "/about/benchmarks" },
                    { text: "Helping & Donating", link: "/about/helping" },
                ],
            },
            {
                text: "Administration",
                items: [
                    { text: "Overview", link: "/admin/introduction" },
                    { text: "Migrating from Bukkit", link: "/admin/migrating-from-bukkit" },
                ],
            },
            {
                text: "Configuration",
                items: [
                    { text: "Introduction", link: "/config/introduction" },
                    { text: "Basic", link: "/config/basic" },
                    { text: "World", link: "/config/world" },
                    { text: "Chat & Anti-Spam", link: "/config/chat" },
                    { text: "Commands", link: "/config/commands" },
                    { text: "Bedrock & NetherNet", link: "/config/bedrock" },
                    { text: "Proxy", link: "/config/proxy" },
                    { text: "Authentication", link: "/config/authentication" },
                    { text: "Packet Limiter", link: "/config/packet-limiter" },
                    { text: "Compression", link: "/config/compression" },
                    { text: "Resource Pack", link: "/config/resource-pack" },
                    { text: "Plugins", link: "/config/plugins" },
                    { text: "Server Links", link: "/config/server-links" },
                    { text: "Player Data", link: "/config/player-data" },
                    { text: "Logging", link: "/config/logging" },
                    { text: "Query", link: "/config/query" },
                    { text: "RCON", link: "/config/rcon" },
                    { text: "PVP", link: "/config/pvp" },
                    { text: "LAN Broadcast", link: "/config/lan-broadcast" },
                ],
            },
            {
                text: "Developers",
                items: [
                    { text: "Contributing", link: "/developer/contributing" },
                    { text: "Introduction", link: "/developer/introduction" },
                    {
                        text: "Networking",
                        link: "/developer/networking/networking",
                        items: [
                            {
                                text: "Authentication",
                                link: "/developer/networking/authentication",
                            },
                            {
                                text: "RCON",
                                link: "/developer/networking/rcon",
                            },
                        ],
                    },
                    { text: "World", link: "/developer/world" },
                    { text: "Mobile dev", link: "/developer/mobile" },
                ],
            },
            {
                text: "Plugin Development",
                items: [
                    {
                        text: "Introduction",
                        link: "/plugin-dev/introduction",
                    },
                    {
                        text: "Migrating from Bukkit",
                        collapsed: false,
                        items: [
                            {
                                text: "Overview",
                                link: "/plugin-dev/migrating-from-bukkit/",
                            },
                            {
                                text: "Commands",
                                link: "/plugin-dev/migrating-from-bukkit/commands",
                            },
                            {
                                text: "Events",
                                link: "/plugin-dev/migrating-from-bukkit/events",
                            },
                            {
                                text: "Inventories & GUIs",
                                link: "/plugin-dev/migrating-from-bukkit/inventories",
                            },
                            {
                                text: "Configuration & Data",
                                link: "/plugin-dev/migrating-from-bukkit/configuration",
                            },
                        ],
                    },
                    {
                        text: "Rust",
                        collapsed: false,
                        items: [
                            {
                                text: "Creating Project",
                                link: "/plugin-dev/rust/creating-project",
                            },
                            {
                                text: "Basic Logic",
                                link: "/plugin-dev/rust/basic-logic",
                            },
                            {
                                text: "Events",
                                link: "/plugin-dev/rust/events",
                            },
                            {
                                text: "Commands",
                                items: [
                                    {
                                        text: "First Command",
                                        link: "/plugin-dev/rust/command/first-command",
                                    },
                                    {
                                        text: "Rock-Paper-Scissors",
                                        link: "/plugin-dev/rust/command/rock-paper-scissors",
                                    },
                                ],
                            },
                            {
                                text: "Licensing & Updates",
                                link: "/plugin-dev/rust/plugin-utils",
                            },
                        ],
                    },
                    {
                        text: "Python",
                        collapsed: false,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/plugin-dev/python/quick-start",
                            },
                            {
                                text: "Basic Logic",
                                link: "/plugin-dev/python/basic-logic",
                            },
                            {
                                text: "First Command",
                                link: "/plugin-dev/python/first-command",
                            },
                            {
                                text: "Events",
                                link: "/plugin-dev/python/events",
                            },
                        ],
                    },
                    {
                        text: "C#",
                        collapsed: false,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/plugin-dev/csharp/quick-start",
                            },
                            {
                                text: "First Command",
                                link: "/plugin-dev/csharp/first-command",
                            },
                        ],
                    },
                    {
                        text: "C",
                        collapsed: false,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/plugin-dev/c/quick-start",
                            },
                            {
                                text: "First Command",
                                link: "/plugin-dev/c/first-command",
                            },
                        ],
                    },
                    {
                        text: "Go",
                        collapsed: false,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/plugin-dev/go/quick-start",
                            },
                            {
                                text: "Basic Logic",
                                link: "/plugin-dev/go/basic-logic",
                            },
                            {
                                text: "First Command",
                                link: "/plugin-dev/go/first-command",
                            },
                        ],
                    },
                    {
                        text: "Kotlin",
                        collapsed: false,
                        items: [
                            {
                                text: "Quick Start",
                                link: "/plugin-dev/kotlin/quick-start",
                            },
                            {
                                text: "First Command",
                                link: "/plugin-dev/kotlin/first-command",
                            },
                        ],
                    },
                ],
            },
            {
                text: "Troubleshooting",
                items: [
                    {
                        text: "Common Issues",
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
            message: "Released under the MIT License.",
            copyright: `Copyright © 2024-${new Date().getFullYear()} Aleksandr Medvedev`,
        },
        editLink: {
            pattern:
                "https://github.com/Pumpkin-MC/Pumpkin-Docs/blob/master/docs/:path",
            text: "Edit this page on GitHub",
        },
        lastUpdated: {
            text: "Updated at",
            formatOptions: {
                dateStyle: "medium",
                timeStyle: "medium",
            },
        },
        outline: "deep",
    },
});
