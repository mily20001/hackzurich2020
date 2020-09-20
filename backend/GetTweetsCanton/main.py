# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


import json
import os

from shapely.geometry import shape, Point

geojsonfile = {}



def loadgeojson():
    with open('geojson/swissCantons.json') as f:
        global geojsonfile
        geojsonfile = json.load(f)

def parseTweets():
    tweets = {}
    global geojsonfile

    canton_codes = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI",
                    "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"]

    files = os.listdir('tweets')
    totalfiles = len(files)
    processed = 0
    for filename in files:
        processed += 1
        print("Loaded: " + str(processed) + "/" + str(totalfiles))

        with open('tweets/' + filename, encoding="utf-8") as f:
            filecontent = json.load(f)
        for tweet in filecontent:
            creationdate = tweet["created_at"][0:10]

            if creationdate not in tweets:  # if there werent any tweets with this date before, create dictionary for it
                tweets[creationdate] = {}
                for code in canton_codes:
                    tweets[creationdate][code] = []
            # tweetserver.check(Point(8.600174, 47.362636)) # LONGITUDE, LATITUDE
            code_found = check(Point(
                float(tweet["csv_source_data"]["estimated_longitude"]),
                float(tweet["csv_source_data"]["estimated_latitude"])
            ))
            if code_found != False:
                tweet_simplified = {}
                tweet_simplified["text"] = tweet["text"]
                tweet_simplified["public_metrics"] = tweet["public_metrics"]
                tweet_simplified["id"] = tweet["id"]

                tweets[creationdate][code_found["id"]].append(tweet_simplified)

    return tweets

def check(coords):
    global geojsonfile

    # depending on your version, use: from shapely.geometry import shape, Point

    # load GeoJSON file containing sectors


    # construct point based on lon/lat returned by geocoder
    point = coords

    # check each polygon to see if it contains the point
    for feature in geojsonfile['features']:
        polygon = shape(feature['geometry'])
        if polygon.contains(point):
            # print('Found containing polygon:', feature)
            return feature

    return False



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    loadgeojson()
    tweets = parseTweets()
    with open("tweets.json", 'w', encoding='utf-8') as f:
        json.dump(tweets, f, ensure_ascii=False, indent=4)


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
