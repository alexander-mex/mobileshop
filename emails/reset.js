const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const keys = require('../keys');

const oAuth2Client = new google.auth.OAuth2 (keys.GMAIL_CLIENT_ID, keys.GMAIL_CLIENT_SECRET, keys.GMAIL_REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: keys.GMAIL_REFRESH_TOKEN});

async function resetEmail(email, token){
  try{
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service:'gmail',
      auth:{
        type:'OAuth2',
        user:'alexandermex@gmail.com',
        clientId:keys.GMAIL_CLIENT_ID,
        clientSecret:keys.GMAIL_CLIENT_SECRET,
        refreshToken:keys.GMAIL_REFRESH_TOKEN,
        accessToken
      }
    });
    const mailOptions = {
      from:`Phoneshop <${keys.EMAIL_FROM}>`,
      to:email,
      subject:'Відновлення паролю',
      html:`
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
      <h2 style="color: #333;">Відновлення паролю</h2>
      <p style="color: #666;">Доброго дня!</p>
      <p style="color: #666; text-indent: 20px;;">Ви отримали це повідомлення, оскільки запросили відновлення пароля для вашого облікового запису. Якщо ви не робили запит на відновлення паролю, проігноруйте це повідомлення. Якщо ви дійсно бажаєте відновити пароль, будь ласка, натисніть на посилання нижче:</p>
      <p style="color: #666; margin-bottom: 30px;"><a href="${keys.BASE_URL}/auth/password/${token}">Відновлення паролю</a></p>
      <p style="color: #666;">Це посилання дійсне протягом 10 хвилин.</p>
      <p style="color: #666;">Якщо у вас виникли будь-які питання або потрібна додаткова допомога, будь ласка, зверніться до нашої підтримки.</p>
      <p style="color: #666;">З повагою,</p>
      <p style="color: #666;">Команда сайту Phoneshop!</p>
    </div>
      `
    }
    const result = await transport.sendMail(mailOptions);
    return result;
  }
  catch(err){ return err }
}

module.exports = function(email, token) {
  resetEmail(email, token);
}