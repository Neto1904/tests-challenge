import { Router } from 'express';
import { CreateTransferController } from '../modules/statements/useCases/createTransfer/CreateTransferController';

import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const transferRoutes = Router();
const createTransferController = new CreateTransferController();

transferRoutes.use(ensureAuthenticated);

transferRoutes.get('/:receiver_id', createTransferController.execute);

export { transferRoutes };
