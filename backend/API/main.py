# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


# Press the green button in the gutter to run the script.
import threading

import requests
import csv
import json
from collections import deque

import covidcases
import tweetserver
import articleserver

from shapely.geometry import Point

from aiohttp import web
import asyncio

coronacases = {}
coronacases_sem = threading.Semaphore(1)

tweets = {}

articles = {}
articles_map_id = {}

def tweets_prepare():
    print('Updating tweets...')
    global tweets
    tweets = tweetserver.parseTweets()

def articles_prepare():
    print('Updating articles...')
    global articles
    global articles_map_id
    articles = articleserver.articles_parse()
    articles_map_id = articleserver.articles_build_id_map(articles)

def coronacases_update(dictlist):
    print('Updating cases...')
    coronacases_temp = covidcases.covid_cases_update(dictlist[0], dictlist[1])

    with coronacases_sem:
        global coronacases
        coronacases = coronacases_temp

    print('Updated!')
    threading.Timer(600, coronacases_update, [[dictlist[0], dictlist[1]]]).start()

# Python 3.7+


async def coronacases_download(request):
    with coronacases_sem:
        global coronacases
        return web.Response(text=json.dumps(coronacases[request.query["date"]], ensure_ascii=False, indent=4))

async def tweets_download(request):
    global tweets
    if request.query["date"] not in tweets:
        return web.Response(
            text=json.dumps([], ensure_ascii=False, indent=4))
    if request.query["canton"] not in tweets[request.query["date"]]:
        return web.Response(
            text=json.dumps([], ensure_ascii=False, indent=4))
    return web.Response(text=json.dumps(tweets[request.query["date"]][request.query["canton"]], ensure_ascii=False, indent=4))

async def articles_download(request):
    global articles
    if request.query["date"] not in articles:
        return web.Response(
            text=json.dumps([], ensure_ascii=False, indent=4))
    if request.query["canton"] not in articles[request.query["date"]]:
        return web.Response(
            text=json.dumps([], ensure_ascii=False, indent=4))
    new_arts = []
    for art in articles[request.query["date"]][request.query["canton"]]:
        new_arts.append({
            'id' : art['id'],
            'title' : art['title'],
            'source-full' : art['source-full'],
            'preview' : art['preview'],
            'sentiment' : art['sentiment']
        })
    return web.Response(text=json.dumps(new_arts, ensure_ascii=False, indent=4))

async def article_download(request):
    global articles_map_id
    if int(request.query["id"]) not in articles_map_id:
        return web.Response(
            text=json.dumps([], ensure_ascii=False, indent=4))

    return web.Response(text=json.dumps(articles_map_id[int(request.query["id"])], ensure_ascii=False, indent=4))

if __name__ == '__main__':

    # tweetserver.check(Point(8.600174, 47.362636)) # LONGITUDE, LATITUDE
    tweets_prepare()
    articles_prepare()

    coronacases_update([tweets, articles])

    app = web.Application()
    app.router.add_get('/api/coronacases', coronacases_download)
    app.router.add_get('/api/tweets', tweets_download)
    app.router.add_get('/api/articles', articles_download)
    app.router.add_get('/api/article', article_download)

    web.run_app(app, port=7777)




# See PyCharm help at https://www.jetbrains.com/help/pycharm/
