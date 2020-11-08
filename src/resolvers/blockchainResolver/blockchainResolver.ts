import publicLedger from './query';

export default {
  Query: {
    publicLedger: (parent: any, args: any, context: any) => publicLedger(context),
  },
};
