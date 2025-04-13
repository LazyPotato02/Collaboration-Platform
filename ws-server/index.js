const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = {};

wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const projectId = url.searchParams.get('project');

    if (!projectId) {
        ws.close(1008, 'Missing project ID');
        return;
    }

    if (!clients[projectId]) {
        clients[projectId] = [];
    }
    clients[projectId].push(ws);

    console.log(`Client connected to project ${projectId}`);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'new_comment') {
                const payload = JSON.stringify({
                    type: 'new_comment',
                    task_id: data.task_id,
                    comment: data.comment
                });

                clients[projectId].forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(payload);
                    }
                });
            }
        } catch (err) {
            console.error('Failed to parse message:', err);
        }
    });

    ws.on('close', () => {
        clients[projectId] = clients[projectId].filter(client => client !== ws);
        console.log(`Client disconnected from project ${projectId}`);
    });
});

app.post('/broadcast', (req, res) => {
    const { project_id, type, task } = req.body;

    if (!clients[project_id]) {
        return res.status(200).json({ status: 'no clients' });
    }

    const message = JSON.stringify({ type, task });

    clients[project_id].forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
        }
    });

    return res.status(200).json({ status: 'sent' });
});

server.listen(8001, () => {
    console.log('✅ WebSocket server running at http://localhost:8001');
});