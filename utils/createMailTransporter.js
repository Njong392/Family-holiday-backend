const nodemailer = require('nodemailer');

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: "njongemy@outlook.com",
            pass: process.env.EMAIL_PASS,
        }
    })

    return transporter
}

module.exports = {createMailTransporter}