const dictionaries = {
  nb: {},
  nn: {},
};

export const getDictionary = async (locale: 'nb' | 'nn') => dictionaries[locale];
