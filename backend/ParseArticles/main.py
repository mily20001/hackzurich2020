# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import json
import sys


def gen_dict_extract(key, var):
    if hasattr(var, 'items'):
        for k, v in var.items():
            if k == key:
                yield v
            if isinstance(v, dict):
                for result in gen_dict_extract(key, v):
                    yield result
            elif isinstance(v, list):
                for d in v:
                    for result in gen_dict_extract(key, d):
                        yield result

# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    import os
    import csv

    csv.field_size_limit(2000000)



    processed = 0

    for filename in os.listdir('Data'):
        artlist = []

        csvfile = open("Data/" + filename, newline='', encoding="UTF-8")
        csvreader = csv.reader(csvfile, delimiter=',')
        iterreader = iter(csvreader)
        next(iterreader)

        for rows in iterreader:
            article = {}
            article["source"] = rows[0]
            article["source-full"] = rows[1]
            article["date"] = rows[2]
            article["lang"] = rows[3]
            article["character-count"] = rows[4]
            article["title"] = rows[5]
            text_temp = json.loads(rows[10])

            whole_text = ""
            for tx_elem in text_temp:
                for elem in gen_dict_extract('text', tx_elem):
                    whole_text += elem
            article["text"] = whole_text

            processed += 1
            if not processed % 100:
                print(str(processed))

            artlist.append(article)

        with open("Results/" + filename + '.json', 'w', encoding='utf-8') as f:
            json.dump(artlist, f, ensure_ascii=False, indent=4)


# See PyCharm help at https://www.jetbrains.com/help/pycharm/
