import Twilio from "twilio";

// twilio 클라이언트를 생성
const twilioClient = Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// 메세지 전송 함수 만들기
export const sendSMS = (to: string, body: string) => {
    return twilioClient.messages.create({
        body,
        to,
        from: process.env.Twilio_PHONE 
    });
};

// verification 에서 key 를 전송하는 걸 이용하며, sendSMS 함수를 이용함
export const sendVerificationSMS = (to: string, key: string) => 
    sendSMS(to, `Your verification key is: ${key}`)
