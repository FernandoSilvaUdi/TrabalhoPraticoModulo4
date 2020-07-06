import express from 'express';
import { accountsModel } from '../models/accounts.js';
import { formatNumber } from '../helpers/formatHelpers.js';

const router = express.Router();

router.get('/', async (_, res) => {
  try {
    const accounts = await accountsModel.find({}).sort({ agencia: 1 });

    res.send(accounts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/deposit', async (req, res) => {
  console.log('cheguei no put');
  try {
    const params = req.body;
    console.log(params);

    const { agencia, conta, balance } = params;

    if (agencia < 1 || conta < 1) {
      throw new Error('Favor informar os parâmetros de conta e agência válidos!');
    }
    const account = await accountsModel.findOneAndUpdate(
      { agencia: agencia, conta: conta }, // filtro
      { $inc: { balance: balance } }, // informações a serem atualizados
      { new: true } // retorno para o campo account
    );

    res.send(`O saldo atual da conta é de ${formatNumber(account.balance)}.`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/withdraw', async (req, res) => {
  try {
    const params = req.body;
    const { agencia, conta, balance } = params;

    if (agencia < 1 || conta < 1) {
      throw new Error('Favor informar os parâmetros de conta e agência válidos!');
    }
    const account = await accountsModel.findOneAndUpdate(
      {
        agencia: agencia,
        conta: conta,
        balance: { $gte: balance + 1 },
      }, // filtro
      { $inc: { balance: -(balance + 1) } }, // informações a serem atualizados
      { new: true } // retorno para o campo account
    );
    if (!account) throw new Error('Saldo insuficiante!');

    res.send(`O saldo atual da conta é de ${formatNumber(account.balance)}.`);
  } catch (err) {
    res.status(400).send({ error: `Conta não encontrada!` });
  }
});

router.get('/consult', async (req, res) => {
  try {
    const params = req.body;
    const { agencia, conta } = params;

    if (agencia < 1 || conta < 1) {
      throw new Error('Favor informar os parâmetros de conta e agência válidos!');
    }
    const account = await accountsModel.findOne({ agencia: agencia, conta: conta });

    res.send(`O saldo atual da conta é de ${formatNumber(account.balance)}.`);
  } catch (err) {
    res.status(400).send({ error: `Conta não encontrada!` });
  }
});

router.delete('/', async (req, res) => {
  try {
    const params = req.body;
    const { agencia, conta } = params;

    if (agencia < 1 || conta < 1) {
      throw new Error('Favor informar os parâmetros de conta e agência válidos!');
    }

    await accountsModel.findOneAndDelete({ agencia: agencia, conta: conta });

    const account = await accountsModel.aggregate([
      { $match: { agencia: agencia } },
      { $count: 'total' },
      // { $group: { _id: null, total: { $count: '$balance' } } },
    ]);

    const { total } = account[0];

    if (total > 0) res.send(`Existem ainda ${total} contas abertas para a agência ${agencia}!`);
    else res.send(`Não existem mais contas abertas para a agência ${agencia}!`);
  } catch (err) {
    res.status(400).send({ error: `Conta não encontrada!` });
  }
});

router.patch('/transfer', async (req, res) => {
  try {
    const params = req.body;
    const { origem, destino, valor } = params;

    if (origem < 1 || destino < 1) {
      throw new Error('Favor informar os parâmetros de conta e agência válidos!');
    }

    if (valor < 1) {
      throw new Error('Favor informar um valor de transferência válido!');
    }

    const origin = await accountsModel.findOne({ conta: origem });
    const destiny = await accountsModel.findOne({ conta: destino });

    if (origin.agencia === destiny.agencia && origin.balance >= params.valor + 8) {
      await accountsModel.updateOne({ _id: destiny._id }, { $inc: { balance: params.valor } });
      const account = await accountsModel.findOneAndUpdate(
        { _id: origin._id },
        { $inc: { balance: -params.valor } },
        { new: true }
      );
      res.send(`O saldo atual é ${formatNumber(account.balance)}.`);
    } else {
      await accountsModel.updateOne({ _id: destiny._id }, { $inc: { balance: params.valor } });
      const account = await accountsModel.findOneAndUpdate(
        { _id: origin._id },
        { $inc: { balance: -(params.valor + 8) } },
        { new: true }
      );
      res.send(`O saldo atual é ${formatNumber(account.balance)}.`);
    }
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

router.get('/average', async (req, res) => {
  try {
    const params = req.body;
    const { agencia } = params;

    if (agencia < 1) {
      throw new Error('Favor informar uma agência válida!');
    }
    console.log(agencia);
    const account = await accountsModel.aggregate([
      { $match: { agencia: agencia } },
      { $group: { _id: null, media: { $avg: '$balance' } } },
    ]);

    console.log(account);
    const { media } = account[0];
    console.log(media);

    res.send(`A média de saldo das contas abertas para a agência ${agencia} é de ${formatNumber(media)}!`);
  } catch (err) {
    res.status(400).send({ error: `Agência não encontrada!` });
  }
});

router.get('/minors', async (req, res) => {
  try {
    const params = req.body;
    const { quantidade } = params;

    if (quantidade < 1) {
      throw new Error('Favor informar uma quantidade válida!');
    }

    const accounts = await accountsModel
      .find({}, { _id: 0, agencia: 1, conta: 1, balance: 1 })
      .sort({ balance: 1 })
      .limit(quantidade);

    res.send(accounts);
  } catch (err) {
    res.status(400).send({ error: `Agência não encontrada!` });
  }
});

router.get('/majors', async (req, res) => {
  try {
    const params = req.body;
    const { quantidade } = params;

    if (quantidade < 1) {
      throw new Error('Favor informar uma quantidade válida!');
    }

    const accounts = await accountsModel
      .find({}, { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 })
      .sort({ balance: -1, name: 1 })
      .limit(quantidade);

    res.send(accounts);
  } catch (err) {
    res.status(400).send({ error: `Agência não encontrada!` });
  }
});

// () 12. Crie um endpoint que irá transferir o cliente com maior saldo em conta de cada agência para a agência private agencia=99. O endpoint deverá retornar a lista dos clientes da agencia private.
router.patch('/private', async (req, res) => {
  try {
    const accounts = await accountsModel.find().distinct('agencia');

    accounts.forEach(async (agency) => {
      const maior = await accountsModel.findOne({ agencia: agency }).sort({ balance: -1 }).limit(1);

      await accountsModel.findOneAndUpdate({ _id: maior._id }, { agencia: 99 }, { new: true });
    });

    const privateClient = await accountsModel.find({ agencia: 99 });

    res.send(privateClient);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

export default router;
