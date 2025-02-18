import Role from "./role.model.js"

export const saveRole = async (req, res) => {
    try {
        const data = req.body;
        const existeRol = await Role.findOne({ role: data.role });

        if(existeRol) {
            return res.status(400).json({
                success: false,
                message: `El rol ${data.role} ya existe en la base de datos`
            });
        }

        const role = new Role({
            ...data
        })

        await role.save();

        res.status(200).json({
            success: true,
            message: '¡¡Role guardado exitosamente!!',
            role
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Solo se pueden ingresar 2 roles que son: STUDENT_ROLE o TEACHER_ROLE",
            error
        })
    }
}