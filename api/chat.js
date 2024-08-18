// api/chat.js
const { exec } = require('child_process');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const prompt = req.body.prompt;

        exec(`python3 chat.py "${prompt}"`, (error, stdout, stderr) => {
            if (error) {
                res.status(500).json({ error: error.message });
                return;
            }
            if (stderr) {
                res.status(500).json({ error: stderr });
                return;
            }
            res.status(200).json({ response: stdout.trim() });
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

