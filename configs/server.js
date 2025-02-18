'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
<<<<<<< HEAD
=======
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import roleRoutes from '../src/role/role.routes.js';
import teacherRoutes from '../src/teacher/teacher.routes.js'
import studentRoutes from '../src/student/student.routes.js'
import courseRoutes from '../src/course/course.routes.js'
import asignatedCourseRoutes from '../src/asignarCourse/asignedCourse.routes.js'

>>>>>>> feature/course
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
<<<<<<< HEAD
}

const routes = (app) => {

=======
    app.use(limiter);
}

const routes = (app) => {
    app.use("/academicManager/v1/roles", roleRoutes);
    app.use("/academicManager/v1/teachers", teacherRoutes);
    app.use("/academicManager/v1/students", studentRoutes);
    app.use("/academicManager/v1/courses", courseRoutes);
    app.use("/academicManager/v1/asigned", asignatedCourseRoutes);
>>>>>>> feature/course
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('¡¡¡¡Conexión a la base de datos exitosa!!!!');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failded: ${error}`);
    }
}