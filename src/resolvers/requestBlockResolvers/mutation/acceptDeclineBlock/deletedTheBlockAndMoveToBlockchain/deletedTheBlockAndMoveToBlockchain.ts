import deletedTheBlock from '../deletedTheBlock';

import Block, { TBlock } from 'src/Blokchain/Block';
import BlockModel from 'src/models/BlockModel';

export default async function deletedTheBlockAndMoveToBlockchain(
  message: string, blockId: string, ownerId: string,
) {
  try {
    const [lastElementOfBlockchain] = await BlockModel.find().slice('array', 0).lean() as TBlock[];
    let block;
    if (lastElementOfBlockchain) {
      block = new Block({ prevHash: lastElementOfBlockchain.prevHash, data: message });
    } else {
      block = new Block({ prevHash: '0', data: message });
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
