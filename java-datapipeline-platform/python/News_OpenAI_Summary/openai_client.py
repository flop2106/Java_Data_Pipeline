import os
import requests
import json
import pandas as pd
import argparse
from dotenv import load_dotenv

def send_message_to_openai(message: str, role: str) -> str:
    """
    Sends a chat message to OpenAI and returns the response content.
    """
    API_URL = "https://api.openai.com/v1/chat/completions"
    env_path = r"C:\Users\nurar\OneDrive\Desktop\Java Data Pipeline Platform\Java_Data_Pipeline\java-datapipeline-platform\python\News_OpenAI_Summary\.env"
    load_dotenv(dotenv_path = env_path)
    API_KEY = os.getenv('openai')
    
    request_body = {
        "model": "gpt-4o-mini",  # Use "gpt-3.5-turbo" if preferred
        "messages": [
            {
                "role": "system",
                "content": role
            },
            {
                "role": "user",
                "content": message
            }
        ],
        "temperature": 0.7
    }
    try:
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        response = requests.post(API_URL, headers=headers, json=request_body)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error communicating with OpenAI: {str(e)}"

# For testing purpose:
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="OpenAI Result")
    parser.add_argument("--folder_path", type= str, default = r"Java_Data_Pipeline\java-datapipeline-platform\python\News_OpenAI_Summary")
    parser.add_argument("--query", type= str, default = r"Summarize the overall news in 1 paragraph ")
    parser.add_argument("--gpt_role", type= str, default = r"You are an expert in global economy")
    args = parser.parse_args()

    folder_path = args.folder_path
    query = args.query
    role = args.gpt_role

    news_list = pd.read_csv(fr"{folder_path}\news_list.csv")
    query_full = f"{query}: {news_list.to_json()}"
    
    respond = send_message_to_openai(query_full, role)
    print("Response from OpenAI:")
    print(respond)
    pd.DataFrame({"query":[query], "role":[role], "respond": [respond]}).to_csv(fr"{folder_path}\respond.csv")
