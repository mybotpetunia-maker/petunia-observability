// Vercel serverless function to serve live status
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  try {
    // Try to read from data.json (synced from workspace)
    const dataPath = join(process.cwd(), 'data.json');
    let status;
    
    try {
      const data = readFileSync(dataPath, 'utf8');
      status = JSON.parse(data);
      // Update timestamp to show it's live
      const now = new Date();
      status.updatedAt = now.toLocaleString('en-US', { 
        timeZone: 'America/Chicago',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch (e) {
      // Fallback if data.json doesn't exist yet
      const now = new Date();
      status = {
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
        currentTask: "Awaiting memory sync",
        status: "running",
        activeWork: [],
        completedTasks: [],
        lanes: [],
        events: ["Waiting for first memory sync..."],
        worklog: []
      };
    }
    
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate status', message: error.message });
  }
}
