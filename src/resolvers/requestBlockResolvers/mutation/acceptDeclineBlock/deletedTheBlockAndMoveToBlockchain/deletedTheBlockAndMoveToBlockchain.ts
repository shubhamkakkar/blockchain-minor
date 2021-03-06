import deletedTheBlock from '../deletedTheBlock';

import Block from 'src/Blokchain/Block';
import BlockModel from 'src/models/BlockModel';
import { RequestedBlockMessage, TPublicLedger } from 'src/generated/graphql';

export default async function deletedTheBlockAndMoveToBlockchain(
  message: string, messageType: RequestedBlockMessage, blockId: string, ownerId: string,
) {
  try {
    const [lastElementOfBlockchain] = await BlockModel.find().slice('array', 0).lean() as TPublicLedger[];
    let block;
    if (lastElementOfBlockchain) {
      block = new Block({ prevHash: lastElementOfBlockchain.prevHash, data: message, messageType });
    } else {
      block = new Block({ prevHash: '0', data: message, messageType });
    }
    // @ts-ignore
    block.ownerId = ownerId;
    const blockOfBlockChain = new BlockModel(block);
    await blockOfBlockChain.save();
    await deletedTheBlock(blockId);
  } catch (e) {
    console.log('deletedTheBlockAndMoveToBlockchain e()', e);
    throw e;
  }
}
