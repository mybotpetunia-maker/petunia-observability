#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WORKSPACE = process.env.WORKSPACE || '/Users/petunia1/.openclaw/workspace';
const MEMORY_DIR = path.join(WORKSPACE, 'memory');

// Find all memory files from the last 2 days
const files = fs.readdirSync(MEMORY_DIR)
  .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
  .sort()
  .slice(-2); // Last 2 files

let completedTasks = [];

for (const file of files) {
  const filePath = path.join(MEMORY_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = content.split(/^## /gm).filter(s => s.trim());
  const completed = sections.filter(s => s.startsWith('Completed Tasks'));

  for (const section of completed) {
    const lines = section.split('\n');
    const header = lines[0];
    const timeMatch = header.match(/\(([^)]+)\)/);
    const time = timeMatch ? timeMatch[1] : '';
    const date = file.replace('.md', '');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith('- ✅')) {
        const task = line.replace(/^[- ]*✅\s*/, '').trim();
        completedTasks.push({ 
          step: task, 
          owner: 'Petunia', 
          completedAt: `${date} ${time}`, 
          state: 'done' 
        });
      }
    }
  }
}

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
  completedTasks: completedTasks.reverse().slice(0, 20), // Last 20 tasks, newest first
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
  worklog: completedTasks.slice(0, 5).map(t => t.step)
};

fs.writeFileSync('data.json', JSON.stringify(status, null, 2));
console.log(`✅ Synced ${completedTasks.length} completed tasks from ${files.length} memory files`);
