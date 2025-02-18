import Course from "../course/course.model.js"
import Student from "../student/student.model.js"
import Teacher from "../teacher/teacher.model.js"
import AsignedCourse from "./asignedCourse.model.js"
import { response, request } from "express"

export const saveAsignedStudent = async (req, res) => {
    try {
        const data = req.body;
        const student = await Student.findOne({ email: data.email });
        const course = await Course.findOne({ name: data.name.toLowerCase() });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Estudiante no encontrado'
            });
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Curso no encontrado'
            });
        }

        if (course.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso esta desactivado, no se puede asignar'
            });
        }

        const existeAsignacion = await AsignedCourse.findOne({
            student: student._id,
            course: course._id
        });

        if (existeAsignacion) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante ya esta asignado a este curso'
            });
        }

        const conteoCursosAsignados = await AsignedCourse.countDocuments({
            student: student._id
        });

        if (conteoCursosAsignados >= 3) {
            return res.status(400).json({
                success: false,
                message: 'El estudiante solo puede estar asignado a máximo 3 cursos'
            });
        }

        const asigned = await AsignedCourse.create({
            ...data,
            student: student._id,
            email: student.email,
            course: course._id,
            name: course.name,
            role: "STUDENT_ROLE"
        });

        const details = {
            studentEmail: student.email,
            courseName: course.name,
        };

        res.status(200).json({
            success: true,
            message: 'Alumno asignado correctamente',
            asigned,
            details
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al asignar el curso al alumno',
            error
        });
    }
};


export const getAsigned = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [ total, asignedCourse ] = await Promise.all([
            AsignedCourse.countDocuments(query),
            AsignedCourse.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            asignedCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting Asignations',
            error
        })
    }
}

export const getAsignedCourseById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const asignedCourse = await AsignedCourse.findById(id);

        if (asignedCourse.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso buscado no esta disponible'
            })
        }

        if (!asignedCourse) {
            return res.status(400).json({
                success: false,
                message: 'Asignation Course not found'
            });
        }

        res.status(200).json({
            success: true,
            asignedCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting asignation course by ID',
            error
        })
    }
}

export const getCoursesById = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.query; // role puede ser 'student' o 'teacher'

        // Verificar que se haya pasado el role
        if (!role || (role !== 'STUDENT_ROLE' && role !== 'TEACHER_ROLE')) {
            return res.status(400).json({
                success: false,
                message: 'Debe especificar un rol: "STUDENT_ROLE" o "TEACHER_ROLE"'
            });
        }

        let query = {};
        if (role === 'STUDENT_ROLE') {
            query.student = id; // Si el rol es 'student', buscamos por student
        } else if (role === 'TEACHER_ROLE') {
            query.teacher = id; // Si el rol es 'teacher', buscamos por teacher
        }

        // Buscar todos los cursos asignados a este estudiante o profesor
        const asignedCourses = await AsignedCourse.find(query);

        if (asignedCourses.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No se encontraron cursos asignados para este ${role}`
            });
        }

        // Obtener los cursos asociados sin usar populate, solo los campos necesarios
        const courses = asignedCourses.map((asignedCourse) => ({
            courseId: asignedCourse.course.toString(), // Convertir ObjectId a string si es necesario
            courseName: asignedCourse.name
        }));

        res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los cursos asignados',
            error: error.message || error
        });
    }
};


