import Proyect from '../models/Proyect';

//funcion para crear un proyecto 
export const createProyect = async (req, res) => {
	try {
		const {name, category, description, imgURL, estado} = req.body 
		const newProyect = new Proyect({
			name, 
			category, 
			description, 
			state: estado, 
			imgURL});
		const proyectSaved = await newProyect.save();
		console.log(proyectSaved);
		//si el proyecto se creo correctamente 
		res.status(201).json({
			message: "Proyecto creado con exito",
			proyect: proyectSaved
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error al crear el proyecto"})
	}
}

//funcion para obtener todos los proyectos de la db
export const getProyect = async (req, res) => {
	try {
		const proyects = await Proyect.find();
		console.log(proyects);
		res.status(201).json({
			message: "Proyectos obtenidos con exito",
			proyects: proyects
		})
	} catch (error) {
		console.log(error);
		res.status(401).json({message: "Error al obtener los proyectos"})
	}
}

//funcion para obtener solo un proyecto por el id
export const getProyectById = async (req, res) => {
	try {
		console.log(req.params.proyectId);
		const product = await Proyect.findById(req.params.proyectId);
		res.status(200).json(product, {
			message: "Proyecto obtenido con exito"
		})	
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error al obtener el proyecto"})
	}
}

//funcion para actualizar un proyecto por id
export const updateProyectById = async	 (req, res) => {
	try {
		const updateProyect = await Proyect.findByIdAndUpdate(req.params.proyectId, req.body, {
		new: true
		})
		res.status(201).json ({
			message: "Proyecto actualizado con exito",
			proyect: updateProyect
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error al actualizar el proyecto"})
	}
}

// funcion para eliminar un proyecto por id
export const deleteProyectById = async  (req, res) => {
	try {
		const { proyectId } = req.params;
		await Proyect.findByIdAndDelete(proyectId);
		res.status(201).json({message: "Proyecto Eliminado con exito"})
	} catch (error) {
		console.log(error);
		res.status(500).json({message: "Error al eliminar el proyecto"})
		
	}
}
