import { defineConfig } from "vitepress";

export const fr = defineConfig({
    lang: "fr",
    description: "Un logiciel de serveur Minecraft haute permformance écrit en Rust",

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
                text: "À propos",
                items: [
                    { text: "Benchmarks", link: "/fr/about/benchmarks" },
                    { text: "Aide & Donations", link: "/fr/about/helping" },
                ],
            },
            {
                text: "Configuration",
                items: [
                    { text: "Introduction", link: "/fr/config/introduction" },
                    { text: "Basique", link: "/fr/config/basic" },
                    { text: "Proxy", link: "/fr/config/proxy" },
                    { text: "Authentifaction", link: "/fr/config/authentication" },
                    { text: "Compression", link: "/fr/config/compression" },
                    { text: "Pack de texture", link: "/fr/config/resource-pack" },
                    { text: "Commandes", link: "/fr/config/commands" },
                    { text: "RCON", link: "/fr/config/rcon" },
                    { text: "PVP", link: "/fr/config/pvp" },
                    { text: "Connection", link: "/fr/config/logging" },
                    { text: "Query", link: "/fr/config/query" },
                    { text: "Accès au LAN", link: "/fr/config/lan-broadcast" },
                ],
            },
            {
                text: "Developeurs",
                items: [
                    { text: "Contribuer", link: "/fr/developer/contributing" },
                    { text: "Introduction", link: "/fr/developer/introduction" },
                    {
                        text: "Gestion réseau",
                        link: "/fr/developer/networking/networking",
                        items: [
                            {
                                text: "Authentifaction",
                                link: "/fr/developer/networking/authentication",
                            },
                            {
                                text: "RCON",
                                link: "/fr/developer/networking/rcon",
                            },
                        ],
                    },
                    { text: "Monde", link: "/fr/developer/world" },
                    { text: "Développement mobile", link: "/fr/developer/mobile" },
                ],
            },
            {
                text: "Développement de plugin",
                items: [
                    {
                        text: "Introduction",
                        link: "/fr/plugin-dev/introduction",
                    },
                    {
                        text: "Rust",
                        collapsed: false,
                        items: [
                            {
                                text: "Créer un projet",
                                link: "/fr/plugin-dev/rust/creating-project",
                            },
                            {
                                text: "Logique de base",
                                link: "/fr/plugin-dev/rust/basic-logic",
                            },
                            {
                                text: "Évenements",
                                link: "/fr/plugin-dev/rust/events",
                            },
                            {
                                text: "Commandes",
                                items: [
                                    {
                                        text: "Première Commande",
                                        link: "/fr/plugin-dev/rust/command/first-command",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        text: "Python",
                        collapsed: false,
                        items: [
                            {
                                text: "Démarrage Rapide",
                                link: "/fr/plugin-dev/python/quick-start",
                            },
                            {
                                text: "Logique de base",
                                link: "/fr/plugin-dev/python/basic-logic",
                            },
                            {
                                text: "Événements",
                                link: "/fr/plugin-dev/python/events",
                            },
                        ],
                    },
                    {
                        text: "C#",
                        collapsed: false,
                        items: [
                            {
                                text: "Démarrage rapide",
                                link: "/fr/plugin-dev/csharp/quick-start",
                            },
                        ],
                    },
                    {
                        text: "C",
                        collapsed: false,
                        items: [
                            {
                                text: "Démarrage rapide",
                                link: "/fr/plugin-dev/c/quick-start",
                            },
                        ],
                    },
                    {
                        text: "Go",
                        collapsed: false,
                        items: [
                            {
                                text: "Démarrage rapie",
                                link: "/fr/plugin-dev/go/quick-start",
                            },
                            {
                                text: "Logique de base",
                                link: "/fr/plugin-dev/go/basic-logic",
                            },
                        ],
                    },
                    {
                        text: "Kotlin",
                        collapsed: false,
                        items: [
                            {
                                text: "Démarrage rapide",
                                link: "/fr/plugin-dev/kotlin/quick-start",
                            },
                        ],
                    },
                ],
            },
            {
                text: "Troubleshooting",
                items: [
                    {
                        text: "Problèmes communs",
                        link: "/fr/troubleshooting/common_issues.md",
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
            message: "Publié sous la liscence MIT License.",
            copyright: `Copyright © 2024-${new Date().getFullYear()} Aleksandr Medvedev`,
        },
        editLink: {
            pattern:
                "https://github.com/Pumpkin-MC/Pumpkin-Docs/blob/master/docs/:path",
            text: "Modifier cette page sur GitHub",
        },
        lastUpdated: {
            text: "Mis à jour le",
            formatOptions: {
                dateStyle: "medium",
                timeStyle: "medium",
            },
        },
        outline: "deep",
    },
});
