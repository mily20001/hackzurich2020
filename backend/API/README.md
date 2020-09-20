Backend used to serve articles, tweets and corona cases.

Files:
> main.py - web server creation, calling respective submodules functions
> tweetserver.py - tweets parsing to be ready to serve to frontend
> articleserver.py - article parsing to be ready to serve to frontend
> covidcases.py - downloading covid cases file (https://raw.githubusercontent.com/openZH/covid_19/master/COVID19_Fallzahlen_CH_total_v2.csv) and parsing it to be ready to serve to frontend

Inputs:
> articles.json: files with articles from "GetArticlesCanton" project.
> tweets.json: files with tweets from "GetTweetsCanton" project.

Outputs:
> coronadata.json: intermediate file
> coronadata_friendly.json: for debugging purposes