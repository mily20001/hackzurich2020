import json
import csv
import sys
import os
import random

import json
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, SentimentOptions, EntitiesOptions

import nltk
from nltk.tokenize.toktok import ToktokTokenizer
from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
import re
import ntpath
import json
import tqdm

authenticator = IAMAuthenticator('P6Y6IwvlXMt50mYGmmFXUsbWdgoihk07pc_1WnxQ0h64')
natural_language_understanding = NaturalLanguageUnderstandingV1(
    version='2020-08-01',
    authenticator=authenticator
)

natural_language_understanding.set_service_url('https://api.eu-de.natural-language-understanding.watson.cloud.ibm.com/instances/2fec67fb-e992-4f60-8403-f6f41aad1346')

def path_leaf(path):
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)

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


def read_csv( path ):
  try:
    with open(path, encoding='utf-8') as data:
      reader = csv.DictReader(data)
      for row in reader:
        yield row
  except IOError:
    print("ERROR: file [" + path + "] not found/accessible")
    yield ""
    return
  data.close()
    
if __name__ == "__main__":

  # Some rows exceed the default max python csv field_size_limit of 131072.
  csv.field_size_limit(2147483647)
  sos={}
  sname = os.path.basename(__file__)

  scall = sys.argv[0]
  argc = len(sys.argv)
  if argc < 2:
    print ("Usage: " + scall + " <filename1> [filename2, ...]")
    sys.exit(-2)

  # file_dicts = []
  if not os.path.exists('sentiments_all.json'):
    with open('sentiments_all.json', 'a') as f:
      f.write('[')
  else:
    with open('sentiments_all.json') as f:
      downloaded_sentiments = json.load(f)

  for f in range(1, argc):
    csv_path = sys.argv[f]
    print ( "parsing file [" + csv_path + "]:" )
    for idx, row in tqdm.tqdm(enumerate( read_csv(csv_path) )):
      if len([x for x in downloaded_sentiments if x['file_name'] == os.path.basename(csv_path) and x['file_idx'] == idx]) > 0:
        continue
      try:
          tx = json.loads(row["tx"])
      except Exception as e:
        print("ERROR: failed to parse row #" + str(idx) + " from [" + csv_path + "]")
        break
      so = str(row["so_txt"])
      ht = str(row["ht"])
      date = str(row["pubDateTime"])
      lang = str(row["la"])
      whole_text = ""
      for tx_elem in tx:
        for elem in gen_dict_extract('text', tx_elem):
          whole_text += elem
      whole_text.replace('\t', '')
      whole_text = ' '.join(whole_text.split())
      if len(whole_text) == 0:
        continue
      # language = 'german' if lang == 'de' else 'english'
      # tokenizer = ToktokTokenizer()
      # text_tokens = tokenizer.tokenize(whole_text)
      # pattern = re.compile('[\W_]+')
      # text_tokens = [pattern.sub('', x) for x in text_tokens]
      # text_tokens = [x for x in text_tokens if x.lower() not in stopwords.words(language) and x.isalnum()]
      # stemmer = SnowballStemmer(language)
      # text_tokens = [stemmer.stem(x) for x in text_tokens]
      # file_dicts.append({
      #   'type': 'N',
      #   'file_name': path_leaf(csv_path),
      #   'file_idx': idx,
      #   'lang': lang,
      #   'text': ' '.join(text_tokens)
      # })
      # print(whole_text)
      response_sentiment = natural_language_understanding.analyze(text=whole_text,
                                                                  language='de',
                                                                  features=Features(sentiment=SentimentOptions())).get_result()
      # response_entities = natural_language_understanding.analyze(text=whole_text,
      #                                                             features=Features(entities=EntitiesOptions(mentions=True))).get_result()
      # print(json.dumps(response_sentiment, indent=2))
      # print(json.dumps(response_entities, indent=2))
      # input()
      file_sentiment = {
        'file_name': path_leaf(csv_path),
        'file_idx': idx,
        'sentiment': response_sentiment['sentiment']['document']['label'],
        'score': response_sentiment['sentiment']['document']['score']
      }
      with open('sentiments_all.json', 'a') as f:
        f.write(json.dumps(file_sentiment) + ',\n')
      #print("Current index: {}, so_txt: {}, ht: {}, date: {}".format(idx,so,ht,date))
      #print("{},{},{}".format(idx,date,ht))
      #if (idx > 0) and (idx % 30 == 0):
      #  break
    print ( "parsing file [" + csv_path + "]: found #" + str(idx) + " rows" )
  print("\n------")
  #print("\nTotals:")
  #print(sos)
  #print("\n------")
  #print(eng_arts)