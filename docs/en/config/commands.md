# Commands

Pumpkin supports Minecraft commands and allows configuring console, TTY, and permission behaviors in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[commands]
use_console = true
use_tty = true
log_console = true
broadcast_console_to_ops = true
default_op_level = 0

# Optional per-command overrides
[commands.overrides.gamemode]
permission_level = 4

[commands.overrides.tp]
enabled = false
```

:::

### Configuration Options

- **`use_console`**: Whether commands from the console are accepted.
- **`use_tty`**: Whether TTY support (rustyline) is enabled for interactive console input.
- **`log_console`**: Whether commands executed by players are logged to the console.
- **`broadcast_console_to_ops`**: Whether console and RCON command output is broadcast to online operators (matches vanilla `broadcast-console-to-ops`).
- **`default_op_level`**: The OP permission level assigned to non-operators (0 to 4, default: `0`).

## Command Overrides

You can customize permissions or completely disable individual commands using `[commands.overrides.<command>]`. The key is named after the command without the leading slash (e.g. `gamemode`, `tp`).

### Override Options

- **`enabled`**: Whether the command is enabled (default: `true`). When set to `false`, the command is completely hidden: it will not run, will not appear in `/help`, and will not show up in tab completion. Players attempting to run it will receive an unknown command message.
- **`permission_level`**: The minimum permission level required to run the command:
  - `0`: Everyone can use it.
  - `2`: Normal operators (typical cheat commands like `/gamemode`).
  - `3`: Admins (moderation commands like `/kick`, `/ban`).
  - `4`: Server owner (full server management like `/stop`, `/op`).

Leave `permission_level` omitted to keep the command's default permission level.
