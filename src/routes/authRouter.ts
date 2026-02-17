import { Router } from 'express'
import { body, param } from 'express-validator'
import { limiter } from '../config/limiter'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors } from '../middleware/validation'

//declaramos router
const router = Router()
//limitar las peticiones
router.use(limiter)
router.post('/create-account',
    //nombre+string+email
    body('name')
        .notEmpty().withMessage('No puede ir vacio'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('E-mail no valido '),
    //validamos errores
    handleInputErrors,
    AuthController.createAccount)

//router para enviar el token de seguridad
router.post('/confirm-account',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAcccount)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no validado'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no validado'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.validateToken
)
router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('El password es muy corto, minimo 8 caracteres'),
        handleInputErrors,
        AuthController.resetPasswordWithToken
)

export default router