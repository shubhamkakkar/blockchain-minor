import Block, { TBlock } from '../../../../../Blokchain/Block';
import BlockModel from '../../../../../models/BlockModel';
import deletedTheBlock from '../deletedTheBlock/deletedTheBlock';

export default async function deletedTheBlockAndMoveToBlockchain(message: string, blockId: string) {
  try {
    const lastElementOfBlockchain = await BlockModel.find().slice('array', -1).lean() as TBlock[];
    let block;
    if (lastElementOfBlockchain.length) {
      block = new Block({ prevHash: lastElementOfBlockchain[0].prevHash, data: message });
    } else {
      block = new Block({ prevHash: '0', data: message });
    }
    const blockOfBlockChain = new BlockModel(block);
    await blockOfBlockChain.save();
    await deletedTheBlock(blockId);
  } catch (e) {
    console.log('deletedTheBlockAndMoveToBlockchain e()', e);
    throw e;
  }
}
