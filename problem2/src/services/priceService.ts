import { PriceModel } from '@src/models/price.model';
import axios from 'axios';

export const priceService = {
  getPrices: async () => {
    return await axios.get<PriceModel[]>(
      'https://interview.switcheo.com/prices.json'
    );
  },
};
