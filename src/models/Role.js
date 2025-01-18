import { Schema, model } from "mongoose";

export const ROLES = ["user", "admin", "moderator"];

const roleSchema = new Schema(
	{name: String},
	{versionKey: false} //el version key sirve para evitar el __v
);
export default model('Role', roleSchema);