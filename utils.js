import fs from 'fs';
import { DEV_CONSTS } from './constants.js';

const { dataFile, LF, PL, FRQ_R, FRQ } = DEV_CONSTS;

export const getTimecodes = () => {
  const data = fs.readFileSync(dataFile, 'utf-8');

  console.log('type', typeof data);
  console.log('data', data);
};
