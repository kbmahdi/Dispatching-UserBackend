export default () => ({
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://mahdikoubaa:xwEBHXpejRSLeyAG@cluster0.xmhtl2m.mongodb.net/Orange',
  });
  