// index.js
const { exec } = require('child_process');
const { IncomingMessage, request } = require('http');

export default function handler(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });
        req.on('end', () => {
            const prompt = JSON.parse(body).prompt;
            
            exec(`python3 -c "
import sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = 'gpt2-medium'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.eos_token_id

def generate_response(prompt):
    inputs = tokenizer(prompt, return_tensors='pt', padding=True)
    with torch.no_grad():
        outputs = model.generate(
            inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=100,
            temperature=0.7,
            top_p=0.9,
            num_return_sequences=1,
            repetition_penalty=1.2,
            pad_token_id=tokenizer.pad_token_id
        )
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.strip()

if __name__ == '__main__':
    prompt = sys.argv[1]
    print(generate_response(prompt))
" "${prompt}"`, (error, stdout, stderr) => {
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
        });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
