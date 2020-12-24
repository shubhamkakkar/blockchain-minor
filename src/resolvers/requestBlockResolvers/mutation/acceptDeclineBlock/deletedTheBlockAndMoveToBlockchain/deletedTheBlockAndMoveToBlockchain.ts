import deletedTheBlock from '../deletedTheBlock';

import Block, { TBlock } from 'src/Blokchain/Block';
import BlockModel from 'src/models/BlockModel';

export default async function deletedTheBlockAndMoveToBlockchain(
  message: string, blockId: string, ownerId: string,
) {
  try {
    const lastElementOfBlockchain = await BlockModel.find().slice('array', -1).lean() as TBlock[];
    let block;
    if (lastElementOfBlockchain.length) {
      block = new Block({ prevHash: lastElementOfBlockchain[0].prevHash, data: message });
    } else {
      block = new Block({ prevHash: '0', data: message });
    }
    const blockOfBlockChain = new BlockModel({ ...block, ownerId });
    await blockOfBlockChain.save();
    await deletedTheBlock(blockId);
  } catch (e) {
    console.log('deletedTheBlockAndMoveToBlockchain e()', e);
    throw e;
  }
}
