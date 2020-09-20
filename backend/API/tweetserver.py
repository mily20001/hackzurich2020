import json
import os


def parseTweets():
    tweets = {}

    with open('tweets.json', encoding="utf-8") as f:
        tweets = json.load(f)

    return tweets