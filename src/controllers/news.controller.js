const path = require('path');
const { v4: uuid } = require('uuid');
const config = require('../../config')

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/connection');

const create = async (req, res) => {
    try {
        const { title, description, author_id, content } = req.body;
        const { image } = req.files;

        const schema = Joi.object({
            title: Joi.string().min(3).required(),
            description: Joi.string().min(10).required(),
            author_id: Joi.string().required(),
            image: Joi.any().required()
        });
        const { error } = schema.validate(req.body);

        const imageName = `${uuid()}${path.extname(image.name)}`;
        image.mv(`${process.cwd()}/uploads/${imageName}`);

        const news = await prisma.news.create({
            data: {
                title,
                description,
                content,
                author_id,
                image: imageName
            }
        });
        res.json({ message: "News created successfully", news });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, author_id, content } = req.body;
        const { image } = req.files;

        const schema = Joi.object({
            title: Joi.string().min(3),
            description: Joi.string().min(10),
            author_id: Joi.string(),
            image: Joi.any()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const imageName = `${uuid()}${path.extname(image.name)}`;
        image.mv(`${process.cwd()}/uploads/${imageName}`);

        const news = await prisma.news.update(
            { where: { id } },
            {
                data: {
                    title,
                    description,
                    author_id,
                    image: imageName
                }
            }
        )
        res.json({ message: "News updated successfully", news });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });

    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.news.delete({ where: { id } });
        res.json({ message: "News deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const displayAll = async (req, res) => {
    try {
        const news = await prisma.news.findMany();

        const token = req.cookies.Token;
        if (token) {
            const { fullname } = jwt.verify(token, config.jwtSecret);
            return res.render('home', { news, fullname });
        }
        const fullname = "";
        return res.render('home', { news, fullname });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });

    }
}

const displayOne = async (req, res) => {
    try {
        const { id } = req.params;
        const newsData = await prisma.news.findFirst({ where: { id } });

        if (!newsData) {
            console.log('News not found, sending 404');
            return res.status(404).json({ message: "News not found" });
        }

        let viewers = newsData.viewers;
        if (!viewers.includes(req.user.id)) {
            viewers.push(req.user.id);
            await prisma.news.update({where: {
                id
            }, data: {
                viewers,
                views: viewers.length
            }});
        }

        const findAuthor = await prisma.authors.findFirst({where: {id: newsData.author_id}});

        const fullname = req.user.fullname;
        return res.render('news', { newsData, fullname, findAuthor });
    } catch (error) {
        console.log('Error in displayOne:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



module.exports = {
    create,
    update,
    remove,
    displayAll,
    displayOne
}