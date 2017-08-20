import * as Joi from 'joi'




export const idSchema = Joi.object().keys({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

export const heroSchema = Joi.object().keys({
    name: Joi.string().required(),
    aliases: Joi.array().required(),
    occupation: Joi.string().required(),
    gender: Joi.string().required()
})


export const validateParams = (schema, name) => {
    return (req, res, next) => {
        const result: any = Joi.validate({param: req['params'][name]}, schema)
        if (result.error) {
            return res.status(400).json(result.error)
        } else {
            if (!req.value)
                req.value = {}

            if (!req.value['params'])
                req.value['params'] = {}

            req.value['params'][name] = result.value.param
            next()
        }
    }
}


 /**
 * 
 * 
 * @param schema 
 * @returns 
 */

export const validateBody = (schema) => {
    return (req, res, next) => {
        const result: any = Joi.validate(req.body, schema)
        if (result.error) {
            return res.status(400).json(result.error)
        } else {
            if (!req.value)
                req.value = {}
            
            if (!req.value['body'])
                req.value['body'] = {}

            req.value['body'] = result.value
            next()
        }
    }


}