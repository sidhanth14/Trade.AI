import openai
import os
from dotenv import load_dotenv



def ai_response(user_input):
    load_dotenv()
    openai.api_key = os.getenv("OPENAI_API_KEY")
    completion = openai.chat.completions.create(
    model="gpt-4o",
    store=True,
    messages=[
                    {"role": "system", "content": "You are a helpful AI assistant that helps suggest trades relevant trades (e.g., plumber, electrician) to a user based on their request.Please give an answer not exceeding two sentences."},
                    {"role": "user", "content": user_input},
                ],
                max_tokens=100,
                temperature=0.7
    )

    return completion.choices[0].message.content
