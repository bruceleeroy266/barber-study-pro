# Minecraft Bedrock Server Setup Guide

## Quick Start (Windows)

### 1. Download the Server Software

Go to the official Minecraft website and download the Bedrock Dedicated Server:
- **URL:** https://www.minecraft.net/en-us/download/server/bedrock
- Download the **Windows** version

### 2. Create a Server Folder

Create a folder where you want your server to live, for example:
```
C:\MinecraftServer\
```

Extract the downloaded ZIP file into this folder.

### 3. Configure the Server

Open `server.properties` in a text editor and adjust these key settings:

```properties
# Server name (shows in the friends list)
server-name=Gabe's Minecraft Server

# Game mode (survival, creative, adventure)
gamemode=survival

# Difficulty (peaceful, easy, normal, hard)
difficulty=normal

# Max players
max-players=10

# Server port (default 19132 - usually fine to leave)
server-port=19132

# IPv4 port
server-portv6=19133

# Level name (world folder name)
level-name=Bedrock level

# Level seed (leave blank for random)
level-seed=

# Online mode (true = requires Microsoft account, false = offline mode)
online-mode=true

# Allow list (whitelist) - set to true to only allow specific players
allow-list=false

# Player idle timeout in minutes (0 = disabled)
player-idle-timeout=30
```

### 4. Port Forwarding (Required for friends to join)

You need to forward port **19132** (UDP) on your router:

1. Open your router's admin page (usually `192.168.1.1` or `192.168.0.1`)
2. Find "Port Forwarding" or "Virtual Servers"
3. Add a new rule:
   - **Service Name:** Minecraft
   - **Protocol:** UDP
   - **External Port:** 19132
   - **Internal Port:** 19132
   - **Internal IP:** Your computer's local IP (find it with `ipconfig` in Command Prompt)

**To find your local IP:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active connection.

### 5. Start the Server

Double-click `bedrock_server.exe` or create a batch file for easier management:

**start-server.bat:**
```batch
@echo off
cd /d "C:\MinecraftServer"
bedrock_server.exe
pause
```

### 6. Allow Through Windows Firewall

When you first run the server, Windows will ask about firewall access. **Allow it** for both private and public networks.

If you missed the prompt:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add `bedrock_server.exe`

---

## Managing Your Server

### Server Commands (type in the server console):

| Command | Description |
|---------|-------------|
| `help` | Show all commands |
| `list` | Show connected players |
| `kick <player>` | Kick a player |
| `ban <player>` | Ban a player |
| `pardon <player>` | Unban a player |
| `op <player>` | Make player an operator (admin) |
| `deop <player>` | Remove operator status |
| `say <message>` | Broadcast message to all players |
| `stop` | Save and shutdown server |

### Whitelist (Allow List)

1. Set `allow-list=true` in `server.properties`
2. In the server console, type:
   ```
   allowlist add <playername>
   ```

### Backing Up Your World

Your world is stored in the `worlds/` folder. To back up:
1. Stop the server (`stop` command)
2. Copy the `worlds/` folder to a backup location
3. Restart the server

---

## Connecting to Your Server

### From the Same Network (LAN):

1. Open Minecraft Bedrock
2. Go to **Play** → **Servers** → **Add Server**
3. Enter:
   - **Server Name:** Whatever you want
   - **Server Address:** Your computer's local IP (e.g., `192.168.1.100`)
   - **Port:** 19132

### From Outside Your Network (Friends):

They need your **public IP address**:
1. Find it at https://whatismyipaddress.com
2. They enter that IP in the server address field

**Note:** If your public IP changes (most home internet does), consider:
- Dynamic DNS service (like No-IP)
- Asking your ISP for a static IP

---

## Making It Better

### Auto-Restart on Crash

Create `start-loop.bat`:
```batch
@echo off
:loop
bedrock_server.exe
echo Server crashed/restarted! Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto loop
```

### Run as a Windows Service (Advanced)

Use **NSSM** (Non-Sucking Service Manager) to run the server in the background:
1. Download NSSM from https://nssm.cc/download
2. Run: `nssm install MinecraftServer`
3. Point it to your `bedrock_server.exe`
4. Start the service

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Friends can't connect | Check port forwarding, firewall, and that you're giving them your public IP |
| Server won't start | Check if port 19132 is already in use by another program |
| World corruption | Restore from backup in `worlds/` folder |
| High memory usage | Bedrock server is lightweight, but restart it periodically for long-running worlds |

---

## Need Help?

- **Official docs:** https://minecraft.wiki/w/Bedrock_Dedicated_Server
- **Check server logs** in the `logs/` folder for errors

Good luck with your server, Gabe! 🎮
