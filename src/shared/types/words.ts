interface Word {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

type SprintWord = Word & {
  wrong?: string;
  answer?: boolean;
};

interface CardOptions {
  isDifficult: boolean;
  isStudied: boolean;
}

type TxtBkReference = Pick<Word, 'group' | 'page'>;

export {
  Word, CardOptions, SprintWord, TxtBkReference,
};
