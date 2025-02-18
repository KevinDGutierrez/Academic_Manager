import { Router } from "express";
import { check } from "express-validator"
import { existeCourseById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarTeacherJWT } from "../middlewares/validar-jwt.js";
import { validatorNameCourse } from "../middlewares/validator.js";
import { saveCourse, getCourses, getCourseById, updateCourse, deleteCourse} from "./course.controller.js";

const router = Router();

router.post(
    '/',
    [
        validarTeacherJWT,
        check('name', 'El nombre del curso es obligatorio').not().isEmpty(),
        check('description', 'La descripción del curso es obligatoria').not().isEmpty(),
        validatorNameCourse,
        validarCampos
    ],
    saveCourse
)

router.get(
    '/',
    getCourses
);

router.get(
    '/findCourse/:id',
    [
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeCourseById),
        validarCampos
    ],
    getCourseById
);

router.put(
    '/:id',
    [
        validarTeacherJWT,
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeCourseById),
        validatorNameCourse,
        validarCampos
    ],
    updateCourse
);

router.delete(
    '/:id',
    [
        validarTeacherJWT,
        check('id', 'No es ID válido').isMongoId(),
        check('id').custom(existeCourseById),
        validarCampos
    ],
    deleteCourse
)

export default router;