import Block, { TBlock } from '../../../../../Blokchain/Block';

export default function deletedTheBlockAndMoveToBlockchain(message: string) {
// fetch last elem of blockchain, and get its hash
  const block = new Block({ prevHash: '0', data: message });
}
