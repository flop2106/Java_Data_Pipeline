import pandas as pd
import argparse

parser = argparse.ArgumentParser(description="HTML Creator Result")
parser.add_argument("--folder_path", type= str, default = r"Java_Data_Pipeline\java-datapipeline-platform\python\News_OpenAI_Summary")

args = parser.parse_args()

folder_path = args.folder_path

openai_result = pd.read_json(fr"{folder_path}\respond.json")
news_list = pd.read_csv(fr"{folder_path}\news_list.csv")

html_openai_result = f"""
    <!DOCTYPE html>
    <html>
    <body>
        <h1>QUERY:</h1>
        <p>{openai_result["query"].tolist()[0]}</p>
        <h2>ROLE:</h1>
        <p>{openai_result["role"].tolist()[0]}</p>
        <h2>OpenAI Respond:</h1>
        <pre>{openai_result["respond"].tolist()[0]}</pre>
"""
html_content = ""
for i in range(len(news_list)):
    html_content = html_content + f'''
    <p></p>
    <h3>{news_list["Title"].tolist()[i]}</h3>
    <a href="{news_list["url"].tolist()[i]}">{news_list["url"].tolist()[i]}</a>
    <p>{str(news_list["news_content"].tolist()[i])}</p>
    '''

html_footing = "</body></html>"

with open(rf"{folder_path}\index.html","w",encoding="utf-8") as index:
    try:
        index.write(html_openai_result + html_content + html_footing)
    except:
        index.write(html_openai_result)