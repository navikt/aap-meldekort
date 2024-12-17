const dictionaries = {
  nb: () => import('../../lib/dictionary/nb.json').then((module) => module.default),
  nn: () => import('../../lib/dictionary/nn.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'nb' | 'nn') => dictionaries[locale];
