const { checkToken } = require('../utils/jwt');

const prisma = require('../utils/connection');

const isAdmin = async (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({ message: "Permission Denied" });
    }

    checkToken(req.headers.token, async (err, data) => {
        if (err) {
            return res.status(401).json({ message: "Permission Denied" });
        }

        req.user = data;

        const user = await prisma.users.findFirst({where: {id: req.user.id}});
        if (!user.isadmin) {
            return res.status(401).json({ message: "Permission Denied" });
        }

        next();
    })
}

module.exports = isAdmin;