// @ts-ginore
import { sha256 } from 'js-sha256';

import { RequestedBlockMessage } from 'src/generated/graphql';

export type TBlockConstructor = {
  data: any;
  prevHash: string;
  messageType: RequestedBlockMessage
};

export interface TBlock extends TBlockConstructor {
  timeStamp?: number;
  hash: string;
  nounce: number;
}

class Block {
  timeStamp: number;

  data: any;

  messageType: RequestedBlockMessage;

  prevHash: string;

  hash: string;

  nounce: number;

  constructor({ data, prevHash, messageType }: TBlockConstructor) {
    this.data = data;
    this.messageType = messageType;
    this.prevHash = prevHash;
    this.timeStamp = Date.now();
    this.nounce = 1;
    this.hash = this.calcHash();
  }

  calcHash(): string {
    return sha256(this.timeStamp + this.data + this.prevHash + this.nounce);
  }

  /*
   * we are not using the mining strategy
   * as we are validating accept and reject count which is different from the traditional blockchain
   */

  mineBlock(difficulty: number): string {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nounce += 1;
      this.hash = this.calcHash();
    }
    return this.hash;
  }
}

export default Block;
