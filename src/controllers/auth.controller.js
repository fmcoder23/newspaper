const Joi = require('joi');
const bcrypt = require('bcrypt');

const { createToken } = require('../utils/jwt');
const prisma = require('../utils/connection');
const { log } = require('console');

const register = async (req, res) => {
    try {
        const { fullname, username, password } = req.body;
        const schema = Joi.object({
            fullname: Joi.string().min(3).max(50).required(),
            username: Joi.string().alphanum().min(3).max(50).required(),
            password: Joi.string().min(5).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findUser = await prisma.users.findFirst({ where: { username } });
        if (findUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await prisma.users.create({
            data: {
                fullname,
                username,
                password: hashedPassword
            }
        });

        const token = createToken({ id: newUser.id, fullname: newUser.fullname });
        res.cookie("Token", token, { maxAge: 1 * 60 * 60 * 1000 })
        res.redirect("/");

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(50).required(),
            password: Joi.string().min(5).required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const findUser = await prisma.users.findFirst({ where: { username } });
        if (!findUser) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect username or password" });
        }
        const token = createToken({ id: findUser.id, fullname: findUser.fullname });
        res.cookie("Token", token, { maxAge: 1 * 60 * 60 * 1000 })
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const findUser = await prisma.users.findUnique({
            where: {
                username
            }
        })
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Permission Denied" });
        }
        if (!findUser.isadmin) {
            return res.status(401).json({ message: "Permission Denied" });
        }

        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        return res.render('admin-panel', {users, authors, news});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                fullname: true,
                username: true,
                created_at: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = {
    register,
    login,
    getUsers,
    adminLogin
}