import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import { AuthEmail } from "../../../emails/AuthEmail";
import User from "../../../models/User";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
//aplicamos funciones

jest.mock("../../../models/User");
//creamos el mock de haspassword
jest.mock("../../../utils/auth");
//mock del token
jest.mock("../../../utils/token");

describe("AuthController.createAccount", () => {
  //usar ciclos de vida para seguir un flujo
  beforeEach(() => {
    //resetea los mocks de cada prueba
    jest.resetAllMocks();
  });
  it("should return a 409 status an error message if the email is already regsitered", async () => {
    //forzar de que si existe va estars disponible
    (User.findOne as jest.Mock).mockResolvedValue(true);

    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "test@test.com",
        password: "testpassword",
      },
    });
    const res = createResponse();
    //controlador
    await AuthController.createAccount(req, res);

    //esperamos de la prueba
    const data = res._getJSONData();
    expect(res.statusCode).toBe(409);
    //sintaxis llave del objeto
    expect(data).toHaveProperty(
      "error",
      "Un usuario con ese email ya esta registrado",
    );
    expect(User.findOne).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it("should regsiter a new user a success message", async () => {
    //probamos el try

    const req = createRequest({
      method: "POST",
      url: "/api/auth/create-account",
      body: {
        email: "test@test.com",
        password: "testpassword",
        name: "test name",
      },
    });
    const res = createResponse();
    //debemos resolver el isntaciamiento de usuario
    const mockUser = { ...req.body, save: jest.fn() };
    //mock resolve value operaciones asincronas
    (User.create as jest.Mock).mockResolvedValue(mockUser);
    (hashPassword as jest.Mock).mockReturnValue("hashedpassword");
    //luego sigue el token
    (generateToken as jest.Mock).mockReturnValue("123456");
    //hasta que simule podemos resolver con una promesa
    jest
      .spyOn(AuthEmail, "sendConfirmationEmail")
      .mockImplementation(() => Promise.resolve());
    await AuthController.createAccount(req, res);

    //definimos los espcs
    //si se llamo y si fue con req.body
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.password).toBe("hashedpassword");
    expect(mockUser.token).toBe("123456");
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
      name: req.body.name,
      email: req.body.email,
      token: "123456",
    });
    expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(201);
  });
});
