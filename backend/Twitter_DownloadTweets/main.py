# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.


def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.


# Press the green button in the gutter to run the script.

#    print_hi('PyCharm')

# import twitter
# api = twitter.Api(consumer_key="KEY",
#                  consumer_secret="KEY",
#                  access_token_key="KEY-KEY",
#                  access_token_secret="KEY",
#                  sleep_on_rate_limit=True)
#
#
# print(api.GetStatus("1215453779442552832"))
# xdupa = api.GetStatuses(["1215453779442552832", "1215454020921446402"], False, False, False)
# print_hi('PyCharm')
#
#
# See PyCharm help at https://www.jetbrains.com/help/pycharm/

def saveTweets(tweets, cacheStart):
    filename = "Results/" + str(cacheStart) + ".json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(tweets, f, ensure_ascii=False, indent=4)
    print("Saved file: " + filename)

def getTweets(IDs, tweetdict):
    url = "https://api.twitter.com/2/tweets?tweet.fields=lang,entities,created_at,conversation_id,context_annotations,geo,public_metrics,referenced_tweets&place.fields=full_name,name,place_type,country_code,country&ids=" + ','.join(
        IDs)

    payload = {}
    headers = {
        'Authorization': 'Bearer KEY%2F%KEY%KEY%KEY'
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    if response.status_code != 200:
        print("FAIL: " + str(response.status_code))
        print(response.text.encode('utf8'))
        print(response.headers)
        time.sleep(60)
        return getTweets(IDs, tweetdict)


    results = json.loads(response.text.encode('utf8'))

    for result in results["data"]:
        result["csv_source_data"] = {}
        result["csv_source_data"]["created_at"] = tweetdict[result["id"]][0]
        result["csv_source_data"]["estimated_longitude"] = tweetdict[result["id"]][1]
        result["csv_source_data"]["estimated_latitude"] = tweetdict[result["id"]][2]

    time.sleep(1)

    return results["data"]


if __name__ == '__main__':
    maxTweetsAtOneTime = 100
    savefileevery = 10

    import requests
    import csv
    import time
    import json

    csvfile = open('crowdbreaks_tweets_jan_jun_2020_has_place.csv', newline='')
    csvreader = csv.reader(csvfile, delimiter=',')
    iterreader = iter(csvreader)
    next(iterreader)
    tweetdict = {rows[1]:[rows[0],rows[2],rows[3]] for rows in iterreader}

    idTable = list(tweetdict.keys())



    #print(tweetscsv)

    #idTable = ["1224775015792402432", "1224819947324375040", "1224733907511316480"]

    cachedTweets = []
    cacheStart = 2397000
    cacheSize = 0
    i = range(2397000, len(tweetdict), maxTweetsAtOneTime)
    for n in i:
        if cacheSize >= savefileevery:
            saveTweets(cachedTweets, cacheStart)
            cacheSize = 0
            cacheStart = n
            cachedTweets.clear()
        cachedTweets += getTweets(idTable[n:n+maxTweetsAtOneTime], tweetdict)
        cacheSize += 1

    if cacheSize > 0:
        saveTweets(cachedTweets, cacheStart)

    print("DONE!!!")
