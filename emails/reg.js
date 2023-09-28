const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const keys = require('../keys');

const oAuth2Client = new google.auth.OAuth2 (keys.GMAIL_CLIENT_ID, keys.GMAIL_CLIENT_SECRET, keys.GMAIL_REDIRECT_URI);

oAuth2Client.setCredentials({refresh_token: keys.GMAIL_REFRESH_TOKEN});

async function sendMail(email){
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
      subject:'Реєстрація',
      text:'Реєстрація пройшла успішно!',
      html:`
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Реєстрація пройшла успішно!</h2>
          <h3 style="color: #666; text-align: center;">Доброго дня!</h3>
          <p style="color: #666; text-indent: 20px;">Ви успішно зареєструвалися на нашому сайті. Тепер ви можете насолоджуватися всіма функціями та перевагами нашого сервісу. Якщо у вас виникнуть будь-які питання або потрібна допомога, будь ласка, зв'яжіться з нами. Ми завжди готові допомогти вам. Дякуємо, що приєдналися до нас!</p>
          <p style="color: #666; margin-left: 20px;">З повагою, Команда Phoneshop!</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${keys.BASE_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; font-size: 16px; text-decoration: none; border-radius: 5px;">Перейти до магазину</a>
            </div>
        </div>
      `
    }
    const result = await transport.sendMail(mailOptions);
    return result;
  }
  catch(err){console.log(`Error: ${err}`)};
}

module.exports = function(email) {
  sendMail(email);
}