/**@import controllers @AUTH */
import {signIn,
	getProfile,
	signUp,
	getUsers,
	getUserById,
	updateUser,
	deleteUser
} from './users/auth.controller.js';

/**@export controllers @AUTH */
export { signIn, 
	getProfile,	 
	signUp, 
	getUsers, 
	getUserById, 
	updateUser, 
	deleteUser }; 

/**@import controllers @USERS */
import {createUser,
	getUsers,
	getUser
} from './users/user.controller.js';

/**@export controllers @USERS */
export {
	createUser,
	getUsers,
	getUser
}

/**@import controllers @PROJECTS */
import {createProyect,
	getProyect,
	getProyectById,
	updateProyectById,
	deleteProyectById		
} from './projects/proyects.controller.js';


/**@export controllers @PROJECTS */
export {
	createProyect,
	getProyect,
	getProyectById,
	updateProyectById,
	deleteProyectById
}