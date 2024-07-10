const prisma = require('../utils/connection');
const path = require('path');
const { v4: uuid } = require('uuid');

// Function to truncate content to 10 words and preserve newlines
const truncateContent = (content) => {
    const words = content.split(' ');
    const truncated = words.length > 10 ? words.slice(0, 10).join(' ') + '...' : content;
    return truncated.replace(/\n/g, '<br>');
};

// Users
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, username, isadmin } = req.body;

        // Convert 'isadmin' to a boolean
        const isAdminValue = isadmin === "on";

        await prisma.users.update({
            where: { id },
            data: {
                fullname,
                username,
                isadmin: isAdminValue
            }
        });

        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        // Truncate content
        news.forEach(article => {
            article.truncatedContent = truncateContent(article.content);
        });

        return res.render('admin-panel', { users, authors, news });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// News
const createNews = async (req, res) => {
    try {
        const { title, description, content, author_id } = req.body;
        const { image } = req.files;

        const imageName = `${uuid()}${path.extname(image.name)}`;
        image.mv(`${process.cwd()}/uploads/${imageName}`);

        await prisma.news.create({
            data: {
                title,
                description,
                content,
                author_id,
                image: imageName
            }
        });

        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        // Truncate content
        news.forEach(article => {
            article.truncatedContent = truncateContent(article.content);
        });

        return res.render('admin-panel', { users, authors, news });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" })
    }
};

const removeNews = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.news.delete({ where: { id } });

        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        // Truncate content
        news.forEach(article => {
            article.truncatedContent = truncateContent(article.content);
        });

        return res.render('admin-panel', { users, authors, news });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
};

// Authors
const createAuthor = async (req, res) => {
    try {
        const { fullname } = req.body;

        await prisma.authors.create({
            data: { fullname }
        });

        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        // Truncate content
        news.forEach(article => {
            article.truncatedContent = truncateContent(article.content);
        });

        return res.render('admin-panel', { users, authors, news });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" })
    }
};

const removeAuthor = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.authors.delete({ where: { id } });
        const users = await prisma.users.findMany();
        const authors = await prisma.authors.findMany();
        const news = await prisma.news.findMany();

        // Truncate content
        news.forEach(article => {
            article.truncatedContent = truncateContent(article.content);
        });

        return res.render('admin-panel', { users, authors, news });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
};

module.exports = {
    updateUser,
    createNews,
    removeNews,
    createAuthor,
    removeAuthor
};
