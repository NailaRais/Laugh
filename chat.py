# chat.py
import sys
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def generate_response(prompt):
    model_name = "gpt2-medium"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name)

    tokenizer.pad_token = tokenizer.eos_token
    model.config.pad_token_id = tokenizer.eos_token_id

    inputs = tokenizer(prompt, return_tensors="pt", padding=True)
    
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

if __name__ == "__main__":
    prompt = sys.argv[1]
    print(generate_response(prompt))
