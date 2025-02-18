import { Schema, model } from "mongoose";

const asignedCourseSchema = Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'student',
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"]
    },
    
    name: {
        type: String,
        required: [true, "El name es obligatorio"]
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'teacher',
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course',
        required: [true, "El curso es obligatorio"]
    },
    role: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model('AsignedCourse', asignedCourseSchema);