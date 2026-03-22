import Joi from "joi";

//crear un validation schema de las variables de entorno

export const joiValidationSchema = Joi.object({
     MONGODB : Joi.required(),
    PORT : Joi.number().default(3002),
    DEFAULT_LIMIT: Joi.number().default(7)
})
    
   
