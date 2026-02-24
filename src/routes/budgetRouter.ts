import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { ExpensesController } from "../controllers/ExpenseController";
import { authenticate } from "../middleware/auth";
import { hasAccess, validateBudgetExist, validateBudgetId, validateBudgetInput, validateExpenseId } from "../middleware/Budget";
import { validateExpenseInput, validateExpensetExist } from "../middleware/expense";
import { handleInputErrors } from "../middleware/validation";

const router = Router();
//protegemos todos los metodos
router.use(authenticate)//req.user
//el parametro va llamar al middleware simpre que tenga el id para el expense y budget
router.param('budgetId',validateBudgetId)
router.param('budgetId',validateBudgetExist)
router.param('budgetId',hasAccess)
//validamos con middleware
router.param('expenseId',validateExpenseId)
router.param('expenseId',validateExpensetExist)

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

/**ROUTES FOR EXPENSE using ROA */

router.post('/:budgetId/expenses',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create
)
router.get('/:budgetId/expenses/:expenseId',ExpensesController.getById)
router.put('/:budgetId/expenses/:expenseId',
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById)
router.delete('/:budgetId/expenses/:expenseId',ExpensesController.deleteById)


export default router;
