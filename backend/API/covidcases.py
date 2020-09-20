import requests
import csv
import json
from collections import deque


def covid_cases_update(tweetdict, articledict):
    url = 'https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv'
    r = requests.get(url, allow_redirects=True)
    open("coronadata.csv", 'wb').write(r.content)

    csvfile = open('coronadata.csv', newline='')
    csvreader = csv.reader(csvfile, delimiter=',')
    iterreader = iter(csvreader)
    next(iterreader)
    coviddict = {}
    for rows in iterreader:
        if rows[0] not in coviddict:
            coviddict[rows[0]] = {}
        if rows[2] not in coviddict[rows[0]]:
            coviddict[rows[0]][rows[2]] = {}
        coviddict[rows[0]][rows[2]]["ncumul_tested"] = rows[3]
        coviddict[rows[0]][rows[2]]["ncumul_conf"] = rows[4]
        coviddict[rows[0]][rows[2]]["new_hosp"] = rows[5]
        coviddict[rows[0]][rows[2]]["current_hosp"] = rows[6]
        coviddict[rows[0]][rows[2]]["current_icu"] = rows[7]
        coviddict[rows[0]][rows[2]]["current_vent"] = rows[8]
        coviddict[rows[0]][rows[2]]["ncumul_released"] = rows[9]
        coviddict[rows[0]][rows[2]]["ncumul_deceased"] = rows[10]
        coviddict[rows[0]][rows[2]]["source"] = rows[11]
        coviddict[rows[0]][rows[2]]["current_isolated"] = rows[12]
        coviddict[rows[0]][rows[2]]["current_quarantined"] = rows[13]
        # coviddict[rows[0]][rows[2]]["current_quarantined_riskareatravel"] = rows[14]
        # coviddict[rows[0]][rows[2]]["current_quarantined_total"] = rows[15]

    canton_codes = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI",
                    "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"]
    coviddict_friendly = {}

    # pass 1 - insert known 'total' data. if there is no data, leave blank
    for date in coviddict:
        coviddict_friendly[date] = {}
        for code in canton_codes:
            coviddict_friendly[date][code] = {}

            coviddict_friendly[date][code]["tweets"] = 0
            coviddict_friendly[date][code]["score"] = 0

            coviddict_friendly[date][code]["confirmed_7delta"] = 0
            coviddict_friendly[date][code]["deceased_7delta"] = 0
            coviddict_friendly[date][code]["released_7delta"] = 0

            coviddict_friendly[date][code]["confirmed_1delta"] = 0
            coviddict_friendly[date][code]["deceased_1delta"] = 0
            coviddict_friendly[date][code]["released_1delta"] = 0

            if code in coviddict[date]:
                coviddict_friendly[date][code]["confirmed_total"] = coviddict[date][code]["ncumul_conf"]
                coviddict_friendly[date][code]["deceased_total"] = coviddict[date][code]["ncumul_deceased"]
                coviddict_friendly[date][code]["released_total"] = coviddict[date][code]["ncumul_released"]
            else:
                coviddict_friendly[date][code]["confirmed_total"] = ""
                coviddict_friendly[date][code]["deceased_total"] = ""
                coviddict_friendly[date][code]["released_total"] = ""

    # pass 2 - interpolate unknown 'total' data  # dictionaries with type and canton as a keys
    LastSeen = {"confirmed_total": {}, "deceased_total": {}, "released_total": {}}
    SeenDaysAgo = {"confirmed_total": {}, "deceased_total": {}, "released_total": {}}

    for code in canton_codes:
        LastSeen["confirmed_total"][code] = -1
        LastSeen["deceased_total"][code] = -1
        LastSeen["released_total"][code] = -1
        SeenDaysAgo["confirmed_total"][code] = []
        SeenDaysAgo["deceased_total"][code] = []
        SeenDaysAgo["released_total"][code] = []

    article_impression = {"negative": -1, "neutral": 0, "positive": 1}

    for date in coviddict_friendly:
        for code in coviddict_friendly[date]:
            if date in tweetdict:
                coviddict_friendly[date][code]["tweets"] = len(tweetdict[date][code])
            if date in articledict:
                for article in articledict[date][code]:
                    coviddict_friendly[date][code]["score"] += article_impression[article["sentiment"]]

            for type in ["confirmed_total", "deceased_total", "released_total"]:
                if coviddict_friendly[date][code][type] == "" and LastSeen[type][code] == -1:  # no occurence yet
                    coviddict_friendly[date][code][type] = 0
                elif coviddict_friendly[date][code][type] != "" and LastSeen[type][code] == -1:  # first occurence
                    LastSeen[type][code] = date
                    SeenDaysAgo[type][code].clear()
                elif coviddict_friendly[date][code][type] == "" and LastSeen[type][code] != -1:  # no occurence right now
                    SeenDaysAgo[type][code].append(date)
                    coviddict_friendly[date][code][type] = coviddict_friendly[LastSeen[type][code]][code][type]
                elif coviddict_friendly[date][code][type] != "" and LastSeen[type][
                    code] != -1:  # there is occurence right now
                    if len(SeenDaysAgo[type][code]) == 0:  # consecutive occurences
                        LastSeen[type][code] = date
                    else:  # non-censecutive occurences, interpolate missing data
                        cases_delta = (int(coviddict_friendly[date][code][type]) - int(
                            coviddict_friendly[LastSeen[type][code]][code][type])) / (len(SeenDaysAgo[type][code]) + 1)
                        mul = 1
                        for missing_date in SeenDaysAgo[type][code]:
                            coviddict_friendly[missing_date][code][type] = int(
                                round(int(coviddict_friendly[LastSeen[type][code]][code][type]) + cases_delta * mul))
                            mul += 1
                        SeenDaysAgo[type][code].clear()
                        LastSeen[type][code] = date

    # pass 3: compute deltas and fix mixed string and int types
    DaysQueue = {"confirmed": deque(), "deceased": deque(), "released": deque()}
    DaysQueue = deque()
    LastDay = list(coviddict_friendly.keys())[0]

    for date in coviddict_friendly:
        DaysQueue.append(date)
        for code in coviddict_friendly[date]:
            for type in ["confirmed", "deceased", "released"]:
                coviddict_friendly[date][code][type + "_total"] = int(
                    coviddict_friendly[date][code][type + "_total"])  # fix mixed int and str

                coviddict_friendly[date][code][type + "_1delta"] = \
                    coviddict_friendly[date][code][type + "_total"] - coviddict_friendly[LastDay][code][type + "_total"]

            if len(DaysQueue) == 7:  # more than 7 days has passed, compute deltas
                for type in ["confirmed", "deceased", "released"]:
                    coviddict_friendly[date][code][type + "_7delta"] = \
                        coviddict_friendly[DaysQueue[-1]][code][type + "_total"] - coviddict_friendly[DaysQueue[0]][code][
                            type + "_total"]
            else:
                for type in ["confirmed", "deceased", "released"]:
                    coviddict_friendly[date][code][type + "_7delta"] = coviddict_friendly[date][code][type + "_total"]

        if len(DaysQueue) == 7:
            DaysQueue.popleft()
        LastDay = date

    with open('coronadata.json', 'w', encoding='utf-8') as f:
        json.dump(coviddict, f, ensure_ascii=False, indent=4)

    with open('coronadata_friendly.json', 'w', encoding='utf-8') as f:
        json.dump(coviddict_friendly, f, ensure_ascii=False, indent=4)

    return coviddict_friendly
