import axios from 'axios';
import moment from 'moment';
import { throttle } from 'lodash';
import md5 from 'md5';

import { Canton, CantonInfo } from './components/cantons';
import { Article, ArticleCategory } from './components/ArticleList';

interface CantonApiData {
  confirmed_7delta: number;
  deceased_7delta: number;
  released_7delta: number;
  confirmed_1delta: number;
  deceased_1delta: number;
  released_1delta: number;
  confirmed_total: number;
  deceased_total: number;
  released_total: number;
  tweets: number;
  score: number;
}

export type InfectionApiResponse = {
  [key in Canton]: CantonApiData;
};

interface CantonData extends CantonApiData {
  corona_score: number;
  scare_score: number;
}

export type InfectionData = {
  [key in Canton]: CantonData;
};

const getInfectionsFunc = async (key: string, dateString: string): Promise<InfectionData> => {
  const date = moment(dateString);
  const { data } = await axios.get<InfectionApiResponse>('/api/coronacases', {
    params: { date: date.format('YYYY-MM-DD') },
  });

  return Object.keys(data).reduce((all, key) => {
    const typedKey = key as Canton;
    const entry = data[typedKey];
    const score =
      (entry.confirmed_1delta / (entry.confirmed_7delta / 7)) *
        ((entry.confirmed_7delta / CantonInfo[typedKey].population) * 1000) +
      (entry.deceased_7delta / CantonInfo[typedKey].population) * 50000;

    const scare_score =
      (Math.max(0, -entry.score) / CantonInfo[typedKey].population) *
      130000 *
      (date.isBefore('2020-06-10')
        ? 0.5 + ((0.5 * entry.tweets) / CantonInfo[typedKey].population) * 200000
        : 1);
    return {
      ...all,
      [key]: { ...data[typedKey], corona_score: isNaN(score) ? 0 : score * 3, scare_score },
    };
  }, {} as InfectionData);
};

export const getInfections = throttle(getInfectionsFunc, 100, { trailing: true });

export interface TweetData {
  text: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  id: string;
}

interface ArticleApi {
  id: number;
  title: string;
  'source-full': string;
  preview: string;
  sentiment: ArticleCategory;
}

const getTweetsFunc = async (
  key: string,
  { date, canton }: { date: string; canton: Canton }
): Promise<Article[]> => {
  const params = { date: moment(date).format('YYYY-MM-DD'), canton };
  const tReq = axios.get<TweetData[]>('/api/tweets', { params });
  const aReq = axios.get<ArticleApi[]>('/api/articles', { params });

  const [{ data: tData }, { data: aData }] = await Promise.all([tReq, aReq]);
  const tweets = tData.map((entry) => ({
    title: `Tweet #${entry.id}`,
    author: '',
    preview: entry.text,
    id: entry.id,
    likes: entry.public_metrics.like_count,
    category: ArticleCategory.TWITTER,
    titleMd5sum: md5(`Tweet #${entry.id}`),
  }));

  const articles: Article[] = aData.map((entry) => ({
    title: entry.title,
    author: entry['source-full'],
    id: entry.id.toString(),
    category: entry.sentiment,
    preview: entry.preview,
    titleMd5sum: md5(entry.title),
  }));

  return [...tweets, ...articles].sort((a, b) =>
    a.titleMd5sum > b.titleMd5sum ? 1 : a.titleMd5sum === b.titleMd5sum ? 0 : -1
  );
};

export const getTweets = throttle(getTweetsFunc, 250, { trailing: true });

export const getArticle = async (key: string, id: string): Promise<{ text: string }> => {
  const { data } = await axios.get<{ text: string }>('/api/article', { params: { id } });

  return data;
};
