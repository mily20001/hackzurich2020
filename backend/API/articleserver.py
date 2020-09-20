import json
import os


def articles_parse():
    articles = {}

    with open('articles.json', encoding="utf-8") as f:
        articles = json.load(f)

    return articles

def articles_build_id_map(articles):
    idMap = {}
    for date in articles:
        for canton in articles[date]:
            for article in articles[date][canton]:
                idMap[article["id"]] = article
    return idMap