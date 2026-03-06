//slatar router 
import { createRequest, createResponse } from "node-mocks-http";
import { BudgetController } from "../../controllers/BudgetController";
import Budget from "../../models/Budget";
import Expense from "../../models/Expense";
import { budgets } from "../mocks/budgets";

jest.mock('../../models/Budget', () => ({
    //las funciones a  simular
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()


})
)

//que signifca la prueba
describe("BudgetController.GetAll", () => {
    //antes de cada test se ejecute
    beforeEach(() => {
        //cada vez que finalize la prueba ejuctar el mock
        (Budget.findAll as jest.Mock).mockReset();
        //se ejecuta en automatico va ir filtrando
        (Budget.findAll as jest.Mock).mockImplementation((options) => {
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId);
            //resolver promise
            return Promise.resolve(updatedBudgets)
        })


    })
    //prueba asincrona
    it("should retrive 0 budgets for user with ID 1", async () => {
        //Se debe simular en un ambiente lo mas parecido a lo real
        const req = createRequest({
            method: "GET",
            url: "/api/budgets",
            //va obtener desde el controlador solo probamos con el id 1

            user: { id: 1 }
            //aqui recuperamos req.user.id
        });
        //respuesta de la prueba
        //poner punto y coma
        const res = createResponse();
        //importar controlador
        //para que simule el comportamiento de la base de datos simula el where       
        await BudgetController.getAll(req, res);

        const data = res._getJSONData()

        //data es la respuesta de simulado
        expect(data).toHaveLength(2);
        //esperamos un 200
        expect(res.statusCode).toBe(200)
        //no esperamos

    });
    //prueba unitaria Catch son separadas
    it('should handle errors when fetching budgets', async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/budgets",
            user: { id: 1 }

        });
        const res = createResponse();
        //forzar los errores
        (Budget.findAll as jest.Mock).mockRejectedValue(new Error)
        await BudgetController.getAll(req, res);

        //mostar un mensaje
        expect(res.statusCode).toBe(500)
        //ARRGELOS
        expect(res._getJSONData()).toEqual({ error: 'Hubo un error' })



    })

});

describe('BudgetController.create', () => {
    it('Should create a new budget and respond with statuscode 201', async () => {
        //la instancia de budget
        const mockBudget = {
            //resolver con el metodo save
            save: jest.fn().mockResolvedValue(true)
        };
        //generamos el mock para emular
        (Budget.create as jest.Mock).mockResolvedValue(mockBudget)
        const req = createRequest({
            //documentacion
            method: "POST",
            url: "/api/budgets",
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }

        });
        const res = createResponse();
        await BudgetController.create(req, res)
        const data = res._getJSONData()

        //espera la prueba ser exitosa 201
        expect(res.statusCode).toBe(201)
        expect(data).toBe('Presupuesto Creado Correctamente')
        //mandao llamar
        expect(mockBudget.save).toHaveBeenCalled()
        //se mande llamar una vez
        expect(mockBudget.save).toHaveBeenCalledTimes(1)
        //si se mando instaciar con req.body
        expect(Budget.create).toHaveBeenCalledWith(req.body)
    });

    it('Should handle  budget creation error', async () => {
        const mockBudget = {
            save: jest.fn()
        };

        //generamos el mock para emular
        (Budget.create as jest.Mock).mockRejectedValue(new Error)
        const req = createRequest({
            //documentacion
            method: "POST",
            url: "/api/budgets",
            user: { id: 1 },
            body: { name: 'Presupuesto Prueba', amount: 1000 }

        });
        const res = createResponse();
        await BudgetController.create(req, res)
        const data = res._getJSONData()

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({ error: 'Hubo un error' })

        //no se haya mando llamar 
        expect(mockBudget.save).not.toHaveBeenCalled()
        //se instancio
        expect(Budget.create).toHaveBeenCalledWith(req.body)


    })
})

describe('BudgetController.getById', () => {
    beforeEach(() => {
        //filtrar y simular la base de datos
        (Budget.findByPk as jest.Mock).mockImplementation((id) => {
            //filtramos sobre budgets
            const budget = budgets.filter(b => b.id === id)[0]
            //retornmaos el objeto
            return Promise.resolve(budget)
        })

    })

    it('should return a budget with ID 1 and 3 expenses', async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/budgets/:id",
            budget: { id: 1 }
        });
        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData()

        //pruebas
        expect(res.statusCode).toBe(200)
        //debe ser tres gastos
        expect(data.expenses).toHaveLength(3)
        //que haya sido llamado
        expect(Budget.findByPk).toHaveBeenCalled()
        //que solo a sido llamado una vez
        expect(Budget.findByPk).toHaveBeenCalledTimes(1)

        //debe llevarse el modelo de gastos
        expect(Budget.findByPk).toHaveBeenCalledWith(req.budget.id, {
            include: [Expense]
        })

    })

    it('should return a budget with ID 2 and 2 expenses', async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/budgets/:id",
            budget: { id: 2 }
        });
        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData()

        //pruebas
        expect(res.statusCode).toBe(200)
        //debe ser tres gastos
        expect(data.expenses).toHaveLength(2)

    })

    it('should return a budget with ID 3 and 0 expenses', async () => {
        const req = createRequest({
            method: "GET",
            url: "/api/budgets/:id",
            budget: { id: 3 }
        });
        const res = createResponse();
        await BudgetController.getById(req, res);

        const data = res._getJSONData()

        //pruebas
        expect(res.statusCode).toBe(200)
        //debe ser tres gastos
        expect(data.expenses).toHaveLength(0)

    })

})

describe('BudgetController.updateById', () => {
    it('should update the budget and return a success message', async () => {
        //equivale a req.body
        const budgetMock = {
            update: jest.fn().mockResolvedValue(true)
        }

        const req = createRequest({
            method: "PUT",
            url: "/api/budgets/:budgetId",
            //pasarle el mock
            budget: budgetMock,
            body: { name: 'Presupuesto Actualizado', amount: 5000 }
        });
        const res = createResponse();
        await BudgetController.updateById(req, res);

        const data = res._getJSONData()

        expect(res.statusCode).toBe(200);
        expect(data).toBe('Presupuesto actualizado correctamente');
        expect(budgetMock.update).toHaveBeenCalled()
        expect(budgetMock.update).toHaveBeenCalledTimes(1)
        expect(budgetMock.update).toHaveBeenCalledWith(req.body)

    })
})

describe('BudgetController.deleteById',()=>{
    it('should delete the budget and return a success message',async()=>{
        //importar mock el metodo
        const budgetMock={
            destroy:jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: "DELETE",
            url: "/api/budgets/:budgetId",
            //pasarle el mock
            budget: budgetMock,
            
        });
        const res = createResponse();
        await BudgetController.deleteById(req, res);
        expect(res.statusCode).toBe(200)
        //obtener datos
        const data=res._getJSONData()
        expect(data).toBe('Presupuesto eliminado correctamente')
        //llamamos al metodo
        expect(budgetMock.destroy).toHaveBeenCalled()
        expect(budgetMock.destroy).toHaveBeenCalledTimes(1)
        
    })
})