import Course from "./course.model.js"
import AsignedCourse from "../asignarCourse/asignedCourse.model.js"
import { response, request } from "express"

export const saveCourse = async (req, res) => {
    try {

        const data = req.body;

        const course = await Course.create({
            name: data.name.toLowerCase(),
            description: data.description
        })

        res.status(200).json({
            msg: '¡¡Course saved successfully!!',
            courseDetails: {
                course: course
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            msg: 'Course registration failded',
            error
        })
    }
}

export const getCourses = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true };

        const [ total, courses ] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error getting courses',
            error
        })
    }
}

export const getCourseById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const course = await Course.findById(id);

        if (course.estado === false) {
            return res.status(400).json({
                success: false,
                message: 'El curso buscado no esta disponible'
            })
        }

        if (!course) {
            return res.status(400).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.status(200).json({
            success: true,
            course
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting course by ID',
            error
        })
    }
}

export const updateCourse = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const { _id, ...data } = req.body;
        let { name } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        }

        const course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, data, { new: true });

        if (course.name !== updatedCourse.name) {
            await AsignedCourse.updateMany(
                { course: id, role: "STUDENT_ROLE" },
                { $set: { name: updatedCourse.name } }
            );
        }

        res.status(200).json({
            success: true,
            msg: 'Curso actualizado correctamente',
            updatedCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el curso',
            error
        });
    }
};


export const deleteCourse = async (req, res = response) => {
    try {
        
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(id, { estado: false }, { new: true });

        const authenticatedCourse = req.course;

        await AsignedCourse.deleteMany({ course: id, role: 'STUDENT_ROLE' });

        res.status(200).json({
            success: true,
            msg: 'Course deleted successfully',
            course,
            authenticatedCourse
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error deleting course',
            error
        })
    }
}