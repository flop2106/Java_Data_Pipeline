# File: com/project1/trading_automation/model/news.py

import news_api_handler
import pandas as pd
import argparse

class News:
    def __init__(self, title: str, url: str, content: str):
        self.title = title
        self.url = url
        self.content = content

    def summarize(self) -> str:
        """
        Returns a summary of the content using the helper function from the news_api_handler.
        """
        return news_api_handler.summarize_news(self.content)

    @classmethod
    def fetch_news(cls, query: str, max_results: int):
        """
        Retrieves raw news data via the NewsAPIHandler and returns a list of News instances.
        
        Args:
            query (str): The search keyword.
            max_results (int): Maximum number of articles to retrieve.
        
        Returns:
            list[News]: A list of News objects created from the API response.
        """
        raw_news_list = news_api_handler.get_news(query, max_results)
        news_title = []
        news_content = []
        news_url = []
        for raw_news in raw_news_list:
            title = raw_news.get("title", "")
            url = raw_news.get("url", "")
            content = raw_news.get("content", "No Content Available")
            news_title.append(title), news_content.append(content), news_url.append(url)
        
        return pd.DataFrame({"Title":news_title,
                             "url": news_url,
                             "news_content": news_content})

    def __str__(self):
        return f"Title: {self.title}\nURL: {self.url}\nContent: {self.summarize()}\n"

if __name__=="__main__":
    parser = argparse.ArgumentParser(description="NewsAPI Result")
    parser.add_argument("--folder_path", type= str, default = r"Java_Data_Pipeline\java-datapipeline-platform\python\News_OpenAI_Summary")
    parser.add_argument("--query", type= str, default = r"US economy")
    parser.add_argument("--no_of_result", type= int, default = 20)
    args = parser.parse_args()

    folder_path = args.folder_path
    query = args.query
    no_of_result = args.no_of_result
    result_df = News.fetch_news(query, no_of_result)
    result_df.to_csv(fr"{folder_path}\news_list.csv")

