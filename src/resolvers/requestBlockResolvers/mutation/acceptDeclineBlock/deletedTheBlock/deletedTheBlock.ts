import RequestBlockModel from '../../../../../models/RequestBlockModel';

export default async function deletedTheBlock(blockId: string) {
  await RequestBlockModel.findByIdAndDelete(blockId);
}
