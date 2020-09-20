import axios from 'axios';
import moment from 'moment';
import { Canton, CantonInfo } from '../components/cantons';

import { throttle } from 'lodash';

export type InfectionApiResponse = {
  [key in Canton]: {
    confirmed_7delta: number;
    deceased_7delta: number;
    released_7delta: number;
    confirmed_1delta: number;
    deceased_1delta: number;
    released_1delta: number;
    confirmed_total: number;
    deceased_total: number;
    released_total: number;
  };
};

export type InfectionData = {
  [key in Canton]: {
    confirmed_7delta: number;
    deceased_7delta: number;
    released_7delta: number;
    confirmed_1delta: number;
    deceased_1delta: number;
    released_1delta: number;
    confirmed_total: number;
    deceased_total: number;
    released_total: number;
    corona_score: number;
  };
};

const getInfectionsFunc = async (key: string, date: string): Promise<InfectionData> => {
  const { data } = await axios.get<InfectionApiResponse>('/api/coronacases', {
    params: { date: moment(date).format('YYYY-MM-DD') },
  });

  return Object.keys(data).reduce((all, key) => {
    const typedKey = key as Canton;
    const entry = data[typedKey];
    const score =
      (entry.confirmed_1delta / (entry.confirmed_7delta / 7)) *
        ((entry.confirmed_7delta / CantonInfo[typedKey].population) * 1000) +
      (entry.deceased_7delta / CantonInfo[typedKey].population) * 50000;
    return { ...all, [key]: { ...data[typedKey], corona_score: isNaN(score) ? 0 : score * 3 } };
  }, {} as InfectionData);
};

export const getInfections = throttle(getInfectionsFunc, 100, { trailing: true });
