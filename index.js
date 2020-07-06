import express from 'express';
import mongoose from 'mongoose';
// // import { promises } from 'fs';
import accountsRouter from './routes/accountsRouter.js';

// Conexão com o banco de dados mongoose
(async () => {
  try {
    console.log('conectando');
    await mongoose.connect(
      'mongodb+srv://fernandosilvaudi:V2krLbOl8H71STdt@bootcamp.zqebg.gcp.mongodb.net/TrabalhoPratico?retryWrites=true&w=majority',
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

// // const readFile = promises.readFile;
// // const writeFile = promises.writeFile;
const app = express();

// // avisa o express que será utilizado o formato json
app.use(express.json());
app.use('/account', accountsRouter);

app.listen(3000, async () => {
  console.log('testando');
  //   // try {
  //   //   await readFile(fileName, 'utf8');
  //   //   logger.info('API Started!');
  //   // } catch (err) {
  //   //   const initialJson = {
  //   //     nextId: 1,
  //   //     accounts: [],
  //   //   };
  //   //   // método stringfy transforma JSON em String
  //   //   writeFile(fileName, JSON.stringify(initialJson)).catch((err) => {
  //   //     logger.error(err);
  //   //   });
  //   // }
});
