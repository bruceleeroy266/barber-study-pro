# Heartbeat Agent Configuration

## Purpose
Periodic system checks and proactive monitoring.

## Responsibilities
- Check system status every 30 minutes
- Monitor disk space, memory, CPU
- Verify service health
- Report anomalies

## Checklist
- [ ] System resources (CPU, memory, disk)
- [ ] Service status
- [ ] Network connectivity
- [ ] Security updates available
- [ ] Log errors/warnings

## When to Alert
- Disk space < 20%
- Memory usage > 90%
- Service down
- Security updates pending
- Errors in logs

## Output
Log to: `memory/heartbeat-YYYY-MM-DD.md`
Alert via: Main session
