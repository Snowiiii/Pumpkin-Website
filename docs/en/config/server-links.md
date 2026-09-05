# Server Links

Minecraft clients (since 1.21) can display clickable server links in the pause menu and game menus. Configure standard and custom server links under `[server_links]` in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[server_links]
enabled = true
bug_report = "https://github.com/Pumpkin-MC/Pumpkin/issues"
support = ""
status = ""
feedback = ""
community = ""
website = ""
forums = ""
news = ""
announcements = ""

[server_links.custom]
# "Store" = "https://store.example.com"
# "Discord" = "https://discord.gg/example"
```

:::

### Configuration Options

- **`enabled`**: Master switch to enable broadcasting server links to connecting clients (default: `true`).
- **`bug_report`**: Link to server or project bug tracker (default: `"https://github.com/Pumpkin-MC/Pumpkin/issues"`).
- **`support`**: Link to technical support or help desk.
- **`status`**: Link to server uptime/status page.
- **`feedback`**: Link to player feedback or suggestion page.
- **`community`**: Link to community forums or group.
- **`website`**: Link to official website.
- **`forums`**: Link to discussion forums.
- **`news`**: Link to server blog or news page.
- **`announcements`**: Link to announcements page.

### Custom Links

Define arbitrary key-value links shown in client menus under `[server_links.custom]`:

```toml
[server_links.custom]
"Store" = "https://store.example.com"
"Discord" = "https://discord.gg/example"
```
