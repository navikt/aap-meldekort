import nb from './lib/translations/nb.json';
import nn from './lib/translations/nn.json';

type MessagesNb = typeof nb;
type MessagesNn = typeof nn;

type Messages = MessagesNb & MessagesNn;

declare global {
  interface IntlMessages extends Messages {}
}
