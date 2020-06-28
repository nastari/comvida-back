const AWS = {
  acessKeyId: process.env.AWS_EMAIL_ACCESS_KEY_ID,
  secretAcessKey: process.env.AWS_EMAIL_SECRET_ACCESS_KEY,
  region: process.env.AWS_EMAIL_REGION,
  senderEmailId: process.env.AWS_EMAIL_SENDER_EMAIL,
};

export default AWS;
