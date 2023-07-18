const { createMailTransporter } = require("./createMailTransporter");

const sendVerficationMail = (user) => {
  const transporter = createMailTransporter();

  const mailOptions = {
    from: '"Test app" <njongemy@outlook.com>',
    to: user.email,
    subject: "Verify your email",
    html: `<h1>Hi 👀 ${user.first_name}, verify your email by clicking this link...</h1>
        <a href='${process.env.CLIENT_URL}/verify-email?emailToken=${user.emailToken}'>Verify your email</a>
        `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Verification email sent");
    }
  });
};

module.exports = { sendVerficationMail };
