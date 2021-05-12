import { createTransport, getTestMessageUrl } from "nodemailer";

const transport = createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 0,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});


function makeANiceEmail(text: string): string {
    return `
        <div style="
        border: 1px solid black;
        padding: 20px;
        font-family: sans-serif;
        line-height: 2;
        font-size: 20px;
        ">
            <p>${text}</p>
        </div>
    `
}

export async function sendPasswordResetEmail(resetToken: string, to: string) {
    const info = await transport.sendMail({
        to,
        from: 'fahadhayat@outlook.com',
        subject: 'Your password Reset Token!',
        html: makeANiceEmail(`Your password Reset Token is here!
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}"> Click Here to reset </a>
        `)
    }).catch(error => console.error(error));

    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(`Messages sent! Preview it at ${getTestMessageUrl(info)}`);
    }
}
