import { Router } from "express";
import { body } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { validateBudgetId } from "../middleware/Budget";
import { handleInputErrors } from "../middleware/validation";
const router = Router();

router.get("/", BudgetController.getAll);

router.post(
    "/",
    body("name")
        .notEmpty()
        .withMessage("El nombre del presupuesto no puede ir vacio"),
    handleInputErrors,
    body("amount")
        .notEmpty()
        .withMessage("La cantidad del presupuesto no puede ir vacia")
        .isNumeric()
        .withMessage("Cantidad no valida")
        .custom((value) => value > 0)
        .withMessage("El presupuesto debe ser mayor a 0"),
    handleInputErrors,
    BudgetController.create,
);
//routing dinamico
router.get(
    "/:id",
    validateBudgetId,
    BudgetController.getById
);

router.put(
    "/:id",
    //valida primero el middleware
    validateBudgetId,
    body("name")
        .notEmpty()
        .withMessage("El nombre del presupuesto no puede ir vacio"),
    handleInputErrors,
    body("amount")
        .notEmpty()
        .withMessage("La cantidad del presupuesto no puede ir vacia")
        .isNumeric()
        .withMessage("Cantidad no valida")
        .custom((value) => value > 0)
        .withMessage("El presupuesto debe ser mayor a 0"),
    handleInputErrors,
    BudgetController.updateById,
);

router.delete("/:id",
    validateBudgetId,
    BudgetController.deleteById);

export default router;
