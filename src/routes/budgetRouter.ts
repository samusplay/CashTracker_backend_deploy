import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from "../middleware/Budget";
import { handleInputErrors } from "../middleware/validation";

const router = Router();
//el parametro va llamar al middleware simpre que tenga el id
router.param('budgetId',validateBudgetId)
router.param('budgetId',validateBudgetExist)

router.get("/", BudgetController.getAll);

router.post(
    "/",
    validateBudgetInput,
    //maneja los errores generico
    handleInputErrors,
    BudgetController.create,
);
//routing dinamico
router.get(
    "/:budgetId",
    BudgetController.getById
);

router.put(
    '/:budgetId',
    validateBudgetInput,
    handleInputErrors,
    BudgetController.updateById,
);

router.delete('/:budgetId',
    BudgetController.deleteById);

export default router;
