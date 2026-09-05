# Logging

Pumpkin provides customizable logging options in `pumpkin.toml`.

## Configuration

:::code-group

```toml [pumpkin.toml]
[logging]
enabled = true
level = "info"
threads = false
thread_ids = false
target = false
color = true
timestamp = true
timestamp_format = "[hour]:[minute]:[second]"
file = "latest.log"
```

:::

### Configuration Options

- **`enabled`**: Master switch to enable or disable server logging (default: `true`).
- **`level`**: Minimum log level for console and file output. Available levels are `"trace"`, `"debug"`, `"info"`, `"warn"`, `"error"`, and `"off"` (default: `"info"`). Can also be overridden with the `RUST_LOG` environment variable.
- **`threads`**: Whether to include thread names in log messages (default: `false`).
- **`thread_ids`**: Whether to include numeric thread IDs in log messages (default: `false`).
- **`target`**: Whether to include module and component targets in log entries (default: `false`).
- **`color`**: Whether to enable ANSI colored log output in the console (default: `true`).
- **`timestamp`**: Whether to include timestamps in log entries (default: `true`).
- **`timestamp_format`**: Timestamp format string using `time` format description syntax (default: `"[hour]:[minute]:[second]"`).
- **`file`**: File path to write log output to (default: `"latest.log"`).
