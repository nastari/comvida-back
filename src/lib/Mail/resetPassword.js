import AWS from 'aws-sdk';
import awsConfig from '../../config/mail';

export default function resetPassword(email, name, id) {
  AWS.config.update({
    accessKeyId: awsConfig.acessKeyId,
    secretAccessKey: awsConfig.secretAcessKey,
    region: awsConfig.region,
  });

  const ses = new AWS.SES({ apiVersion: '2010-12-01' });

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <html> <body>
          <h3> Olá ${name}.</h3>
          <p> Acesse este <a href='http://localhost:3000/reset/${id}'>link</a>
           para redefinir sua senha. </p>
          <small> Se por acaso considerar engano, apenas desconsidere esta mensagem.</small>
          </body>
          </html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'Entre neste link para digitar sua senha nova.',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'ComVida: Redefina sua senha.',
      },
    },
    Source: `Gabriel Nastari ${awsConfig.senderEmailId}`,
  };

  const sendEmailReceiver = ses.sendEmail(params).promise();

  sendEmailReceiver
    .then((data) => {
      console.log(data);
    })
    .catch((e) => console.log(e));
}
