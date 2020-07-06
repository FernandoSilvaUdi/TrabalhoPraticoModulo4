import express from 'express';
import mongoose from 'mongoose';
import accountsRouter from './routes/accountsRouter.js';
import 'dotenv/config.js'; // encontrei no github

// import dotenv from 'dotenv'; //encontrei no npm
// dotenv.config();

// Conexão com o banco de dados mongoose
(async () => {
  try {
    console.log('conectando');
    console.log(process.env.USERDB);
    console.log(process.env.PWDDB);
    console.log(process.env.PORT);

    await mongoose.connect(
      // 'mongodb+srv://fernandosilvaudi:V2krLbOl8H71STdt@bootcamp.zqebg.gcp.mongodb.net/TrabalhoPratico?retryWrites=true&w=majority',
      `mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@bootcamp.zqebg.gcp.mongodb.net/TrabalhoPratico?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
  } catch (error) {
    console.log('Erro ao conectar ao MongoDB');
  }
})();

const app = express();

// // avisa o express que será utilizado o formato json
app.use(express.json());
app.use('/account', accountsRouter);

app.listen(process.env.PORT, async () => {
  console.log('Iniciando');
});
