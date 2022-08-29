import { METHOD } from './enums';

interface ReqData {
  url: string,
  method: METHOD,
  auth?: boolean,
  body?: string
}

interface UsrAggrWrdsReq {
  id: string;
  group: string;
  page: string;
  wordsPerPage: string;
  filter: string;
}

export { ReqData, UsrAggrWrdsReq };
