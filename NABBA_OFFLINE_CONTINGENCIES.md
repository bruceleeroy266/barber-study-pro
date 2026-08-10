# ASCYN PRO — NABBA Offline Contingencies
**Backup and Offline Demo Strategy**  
**Date:** 2026-08-09  

---

## 1. Overview

This document outlines the offline contingency plan for the NABBA conference demonstration. The goal is to ensure the demo works flawlessly regardless of internet connectivity or technical issues.

---

## 2. Offline Demo Modes

### 2.1 Local Development Server (Primary Backup)

**Setup:**
```bash
# On demo laptop
git clone <repo-url> ascyn-pro-demo
cd ascyn-pro-demo
npm install
echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.local
npm run build
npm start
```

**Access:** http://localhost:3000/demo  
**Pros:**
- Full functionality
- No internet required
- Fast and responsive

**Cons:**
- Requires Node.js installed
- Requires initial setup time

### 2.2 Static Export (Secondary Backup)

**Setup:**
```bash
# Build static export
npm run build
npx next export

# Serve with any static server
npx serve out
# or
python -m http.server 8000 -d out
```

**Access:** http://localhost:3000 or http://localhost:8000  
**Pros:**
- No Node.js required for serving
- Works on any device with a browser
- Can be served from USB drive

**Cons:**
- No server-side features
- No API routes
- Limited interactivity

### 2.3 Progressive Web App (PWA)

**Setup:**
```bash
# Install PWA plugin
npm install next-pwa

# Build with PWA support
npm run build
```

**Features:**
- Installable on demo devices
- Works offline after first load
- Cached assets and data

**Limitations:**
- Requires initial internet connection
- Service worker complexity

---

## 3. Screenshot Backup

### 3.1 Screenshot Capture Script

**Location:** `scripts/capture-screenshots.ts`

```bash
# Capture all demo screenshots
npx tsx scripts/capture-screenshots.ts

# Capture specific route
npx tsx scripts/capture-screenshots.ts --route /demo/student
```

### 3.2 Screenshot Inventory

| Screenshot | Route | Purpose |
|------------|-------|---------|
| `01-demo-landing.png` | `/demo` | Demo selection page |
| `02-student-dashboard.png` | `/demo/student` | Student dashboard overview |
| `03-board-readiness.png` | `/demo/student#dashboard` | Board readiness score |
| `04-chapter-10.png` | `/demo/student#chapter10` | Chapter 10 lesson |
| `05-flashcards.png` | `/demo/student#flashcards` | Flashcard interaction |
| `06-quiz.png` | `/demo/student#quiz` | Quiz interface |
| `07-explanation.png` | `/demo/student#mistakes` | Wrong answer explanation |
| `08-progress.png` | `/demo/student#progress` | Progress tracking |
| `09-instructor-dashboard.png` | `/demo/instructor` | Instructor portal |
| `10-student-detail.png` | `/demo/instructor` | Student detail modal |
| `11-class-report.png` | `/demo/instructor` | Class report generation |
| `12-future-vision.png` | `/demo/student#future` | Roadmap features |

### 3.3 Screenshot Storage

**Location:** `demo-assets/screenshots/`  
**Format:** PNG, 1920x1080  
**Naming:** `NN-description.png` (zero-padded for ordering)

---

## 4. Video Backup

### 4.1 Video Recording Script

**Location:** `scripts/record-demo-video.ts`

```bash
# Record 5-minute demo
npx tsx scripts/record-demo-video.ts --duration 300

# Record 10-minute demo
npx tsx scripts/record-demo-video.ts --duration 600 --output demo-10min.mp4
```

### 4.2 Video Inventory

| Video | Duration | Content |
|-------|----------|---------|
| `demo-5min.mp4` | 5:00 | Complete 5-minute demo flow |
| `demo-10min.mp4` | 10:00 | Extended demo with instructor portal |
| `demo-student.mp4` | 3:00 | Student experience only |
| `demo-instructor.mp4` | 3:00 | Instructor portal only |
| `demo-pitch.mp4` | 1:00 | Elevator pitch with visuals |

### 4.3 Video Specifications

| Property | Value |
|----------|-------|
| Resolution | 1920x1080 |
| Frame Rate | 30fps |
| Format | MP4 (H.264) |
| Audio | AAC, 128kbps |
| Bitrate | 5Mbps |

---

## 5. PDF Handouts

### 5.1 Handout Inventory

| Document | Pages | Purpose |
|----------|-------|---------|
| `ascyn-pro-one-pager.pdf` | 1 | Product overview |
| `ascyn-pro-pilot-program.pdf` | 2 | Pilot program details |
| `ascyn-pro-pricing.pdf` | 1 | Pricing tiers |
| `ascyn-pro-faq.pdf` | 2 | Common questions |
| `ascyn-pro-feature-matrix.pdf` | 1 | Feature comparison |

### 5.2 Handout Generation

**Location:** `scripts/generate-handouts.ts`

```bash
# Generate all handouts
npx tsx scripts/generate-handouts.ts

# Generate specific handout
npx tsx scripts/generate-handouts.ts --type one-pager
```

---

## 6. Offline Data Fallback

### 6.1 Local Storage Fallback

**Implementation:** `src/lib/offline-storage.ts`

```typescript
// Automatically saves demo progress to localStorage
// Restores on page reload if server unavailable
```

### 6.2 IndexedDB Cache

**Implementation:** `src/lib/offline-cache.ts`

```typescript
// Caches demo assets for offline access
// Syncs when connection restored
```

---

## 7. Emergency Demo Kit

### 7.1 USB Drive Contents

```
NABBA-DEMO-USB/
├── demo/
│   ├── ascyn-pro-demo/          # Local server files
│   ├── out/                     # Static export
│   └── screenshots/             # All screenshots
├── videos/
│   ├── demo-5min.mp4
│   ├── demo-10min.mp4
│   └── demo-pitch.mp4
├── handouts/
│   ├── ascyn-pro-one-pager.pdf
│   ├── ascyn-pro-pilot-program.pdf
│   ├── ascyn-pro-pricing.pdf
│   └── ascyn-pro-faq.pdf
├── scripts/
│   ├── start-demo.bat           # Windows startup script
│   ├── start-demo.sh            # Mac/Linux startup script
│   └── README.txt               # Quick start guide
└── assets/
    ├── logo.svg
    ├── business-card.pdf
    └── qr-codes/
```

### 7.2 Quick Start Scripts

**Windows (`start-demo.bat`):**
```batch
@echo off
echo Starting ASCYN PRO Demo...
cd demo\ascyn-pro-demo
start http://localhost:3000/demo
npm start
```

**Mac/Linux (`start-demo.sh`):**
```bash
#!/bin/bash
echo "Starting ASCYN PRO Demo..."
cd demo/ascyn-pro-demo
open http://localhost:3000/demo || xdg-open http://localhost:3000/demo
npm start
```

---

## 8. Network Failure Procedures

### 8.1 Detection

```typescript
// Auto-detect network status
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

function handleOffline() {
  showNotification('Offline mode activated');
  enableOfflineMode();
}
```

### 8.2 Fallback Sequence

```
Internet Failure Detected
        │
        ▼
┌───────────────┐
│ Show offline  │
│ notification  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Switch to     │
│ local data    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ If local      │
│ server fails: │
│ Show          │
│ screenshots   │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ If screenshots│
│ unavailable:  │
│ Play video    │
│ backup        │
└───────────────┘
```

---

## 9. Hardware Backup

### 9.1 Device Inventory

| Device | Purpose | Backup For |
|--------|---------|------------|
| Primary laptop | Main demo | — |
| Secondary laptop | Backup demo | Primary laptop |
| Tablet | Mobile demo | Both laptops |
| Phone | Emergency demo | All devices |
| Portable hotspot | Internet backup | Venue WiFi |

### 9.2 Device Preparation

**All Devices:**
- [ ] Fully charged
- [ ] Demo URL bookmarked
- [ ] Local server installed
- [ ] Screenshots saved locally
- [ ] Videos saved locally
- [ ] Offline mode tested

---

## 10. Testing Checklist

### 10.1 Pre-Conference Testing

- [ ] Local server starts successfully
- [ ] Static export loads correctly
- [ ] Screenshots display properly
- [ ] Videos play smoothly
- [ ] PDFs open correctly
- [ ] Offline mode activates automatically
- [ ] All devices charged and ready
- [ ] USB drive contents verified

### 10.2 Day-of Testing

- [ ] Test internet connection
- [ ] Test local server startup
- [ ] Verify screenshots accessible
- [ ] Verify videos playable
- [ ] Test offline mode
- [ ] Verify backup devices charged
- [ ] Test hotspot connection

---

## 11. Contact Information

| Role | Name | Phone | Responsibility |
|------|------|-------|---------------|
| Technical Lead | [Name] | [Phone] | Technical issues |
| Demo Support | [Name] | [Phone] | Demo assistance |
| IT Support | [Name] | [Phone] | Hardware issues |

---

*Offline contingencies documented: 2026-08-09*
