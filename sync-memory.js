#!/usr/bin/env node
// Sync workspace memory to observability data
const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.WORKSPACE || '/Users/petunia1/.openclaw/workspace';
const TODAY = new Date().toISOString().split("T")[0];
const MEMORY_FILE = path.join(WORKSPACE, 'memory', `${TODAY}.md`);

let completedTasks = [];

// Parse today's memory file for completed tasks (if it exists)
if (fs.existsSync(MEMORY_FILE)) {
  const content = fs.readFileSync(MEMORY_FILE, 'utf8');
  const sections = content.split(/^## /gm).filter(s => s.trim());
  const completed = sections.filter(s => s.startsWith('Completed Tasks'));

  for (const section of completed) {
    const lines = section.split('\n');
    const header = lines[0];
    const timeMatch = header.match(/\(([^)]+)\)/);
    const time = timeMatch ? timeMatch[1] : '';
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('- ✅')) {
        const task = line.replace(/^[- ]*✅\s*/, '').trim();
        completedTasks.push({ 
          step: task, 
          owner: 'Petunia', 
          completedAt: `${TODAY} ${time}`, 
          state: 'done' 
        });
      }
    }
  }
}

// Build status object
const now = new Date();
const status = {
  updatedAt: now.toLocaleString('en-US', { 
    timeZone: 'America/Chicago',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }),
  project: "Live Operations Dashboard",
  currentTask: "Real-time observability tracking",
  status: "running",
  blocker: "None",
  activeWork: [],
  completedTasks: completedTasks.reverse(), // Newest first
  lanes: [
    {
      name: "Lane A — Coltrane Tracker",
      task: "Medication schedule management with cross-device sync",
      status: "healthy",
      nextAction: "Monitor deployment and user feedback",
      owner: "Petunia",
      blockerOwner: "none"
    },
    {
      name: "Lane B — Observability",
      task: "Real-time dashboard syncing with workspace memory",
      status: "running",
      nextAction: "Automatic updates on task completion",
      owner: "Petunia",
      blockerOwner: "none"
    }
  ],
  events: [`${now.toLocaleTimeString('en-US', {timeZone: 'America/Chicago'})} CT | Synced from workspace memory`],
  worklog: completedTasks.map(t => t.step).slice(0, 5)
};

fs.writeFileSync('data.json', JSON.stringify(status, null, 2));
console.log(`✅ Synced ${completedTasks.length} completed tasks to data.json`);
