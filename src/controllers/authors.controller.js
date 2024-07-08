const Joi = require('joi');
const prisma = require('../utils/connection');

const create = async(req, res) => {
    try {
        const {fullname} = req.body;

        const schema = Joi.object({
            fullname: Joi.string().min(3).max(50).required()
        });
        const {error} = schema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.message});
        }

        const author = await prisma.authors.create({
            data: {fullname}
        });
        res.json({message: "Author created successfully", author});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

const update = async(req, res) => {
    try {
        const {id} = req.params;
        const {fullname} = req.body;

        const schema = Joi.object({
            fullname: Joi.string().min(3).max(50).required()
        });
        const {error} = schema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.message});
        }

        const author = await prisma.authors.update({
            where: {id},
            data: {fullname}
        });
        res.json({message: "Author updated successfully", author});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});

    }
}

const remove = async(req, res) => {
    try {
        const {id} = req.params;
        await prisma.authors.delete({where: {id}});
        res.json({message: "Author deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
}

const display = async(req, res) => {
    try {
        const authors = await prisma.authors.findMany({
            select: {
                id: true,
                fullname: true
            }
        });
        res.json(authors);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});

    }
}

module.exports = {
    create,
    update,
    remove,
    display
}