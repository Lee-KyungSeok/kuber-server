import Mailgun from "mailgun-js";

const mailGunClient = new Mailgun({
    apiKey: process.env.MAILGUN_API_KEY || "",
    domain: "sandbox40080e1ede6f4391aae233b069a1e61f.mailgun.org"
});

// 원래는 to 에는 받을 사람을 넣어야 한다. 하지만 유료니까 그냥 나한테만 보냈다.
const sendEmail = (subject:string, html:string) => {
    const emailData = {
        from: "leeseok8347@gmail.com",
        to: "leeseok8347@gmail.com",
        subject,
        html
    };
    return mailGunClient.messages().send(emailData);
};

export const sendVerificationEmail = (fullName: string, key: string) => {
    const emailSubject = `Hello!  ${fullName}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="https://etherland.co.kr/${key}>here</a>`;
    return sendEmail(emailSubject, emailBody);
}