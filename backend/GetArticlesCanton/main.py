# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import json
import os



# Press the green button in the gutter to run the script.
if __name__ == '__main__':

    articles = {}
    article_titles_used = {} # deduplication purposes

    canton_codes = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI",
                    "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"]

    files = os.listdir('articles')
    totalfiles = len(files)
    progress = 0
    id = 0
    for filename in files:
        progress += 1
        print("Loaded: " + str(progress) + "/" + str(totalfiles))

        with open('articles/' + filename, encoding="utf-8") as f:
            filecontent = json.load(f)

        for article in filecontent:
            creationdate = article["date"][0:10]

            if creationdate not in articles:  # if there werent any tweets with this date before, create dictionary for it
                articles[creationdate] = {}
                for code in canton_codes:
                    articles[creationdate][code] = []

            # find canton code in location data of article
            codes_found = {}

            for location_entry in article["Location"]:
                namelist = location_entry["name-list"]
                for code in canton_codes:
                    if namelist.find(";" + code + ";") != -1:
                        codes_found[code] = True


            if len(codes_found) > 0:
                if article["title"] not in article_titles_used:
                    article_titles_used[article["title"]] = True
                    article_simplified = {}
                    article_simplified["id"] = id
                    article_simplified["title"] = article["title"]
                    article_simplified["source-full"] = article["source-full"]
                    text_arr = article["text"].split(".")
                    preview = ""
                    for sentence in text_arr:
                        if(len(preview) + len(sentence) + 1 > 150):
                            break
                        preview += sentence + "."
                    if preview == "":
                        preview = article["text"][0:148] + "..."

                    article_simplified["preview"] = preview
                    article_simplified["text"] = article["text"]
                    article_simplified["sentiment"] = article["sentiment"]

                    for code_found in codes_found:
                        articles[creationdate][code_found].append(article_simplified)

                id += 1

    with open("articles.json", 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=4)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
