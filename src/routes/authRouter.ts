import { Router } from 'express'
import { body } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

//declaramos router
const router=Router()

router.post('/create-account',
    //nombre+string+email
    body('name')
    .notEmpty().withMessage('No puede ir vacio'),
    body('password')
    .isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('email')
    .isEmail().withMessage('E-mail no valido '),
    //validamos errores
    handleInputErrors,
AuthController.createAccount)

//router para enviar el token de seguridad
router.post('/confirm-account',
    limiter,
    body('token')
    .notEmpty()
    .isLength({min:6, max:6})
    .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAcccount)


export default router