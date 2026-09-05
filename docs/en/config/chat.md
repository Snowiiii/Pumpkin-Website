# Chat & Anti-Spam

Pumpkin provides customizable in-game chat formatting and built-in anti-spam protection under `[chat]` in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[chat]
format = "<{DISPLAYNAME}> {MESSAGE}"

[chat.anti_spam]
enabled = true
spam_threshold = 200
message_cost = 20
decay_per_tick = 1
ops_bypass = true
```

:::

### Chat Settings

- **`format`**: The chat message format string (default: `"<{DISPLAYNAME}> {MESSAGE}"`).
  - `{DISPLAYNAME}`: Player display name.
  - `{MESSAGE}`: Chat message text.
  > [!NOTE]
  > Custom chat formatting does not apply when secure chat reporting (`allow_chat_reports = true`) is enabled.

### Anti-Spam Protection

Pumpkin implements a leaky-bucket spam counter to protect the server from spamming players and bot floods:

- **`enabled`**: Whether anti-spam protection is active (default: `true`).
- **`spam_threshold`**: The spam counter threshold in ticks at which a player will be kicked (default: `200` ticks).
- **`message_cost`**: The amount added to the player's spam counter for each chat message or command sent (default: `20` ticks).
- **`decay_per_tick`**: The amount decayed from the player's spam counter on each server tick (default: `1` tick).
- **`ops_bypass`**: Whether server operators bypass anti-spam checks (default: `true`).
