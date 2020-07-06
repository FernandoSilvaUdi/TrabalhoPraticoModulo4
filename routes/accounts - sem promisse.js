var express = require('express');
var fs = require('fs'); // modulo nativo do Node.js para tratar arquivos
var router = express.Router();

// cria metodo post
router.post('/', (req, res) => {
  let account = req.body;

  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      // método parse transforma String em JSON
      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account };
      json.accounts.push(account);

      fs.writeFile(fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/', (_, res) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      delete json.nextId;
      res.send(json);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.get('/:id', (req, res) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      const account = json.accounts.find((account) => account.id === parseInt(req.params.id, 10));

      if (account) {
        res.send(account);
      } else {
        res.end();
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.delete('/:id', (req, res) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let accounts = json.accounts.filter((account) => account.id !== parseInt(req.params.id, 10));
      json.accounts = accounts;

      fs.writeFile(fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.put('/', (req, res) => {
  let newAccount = req.body;

  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      console.log(json);
      let oldIndex = json.accounts.findIndex((account) => account.id === newAccount.id);
      // json.accounts[oldIndex] = newAccount;
      json.accounts[oldIndex].name = newAccount.name;
      json.accounts[oldIndex].balance = newAccount.balance;
      console.log(oldIndex);

      fs.writeFile(fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

router.post('/transaction', (req, res) => {
  let params = req.body;

  fs.readFile(fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let index = json.accounts.findIndex((account) => account.id === params.id);

      if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
        throw new Error('Não há saldo sufuciente.');
      }
      json.accounts[index].balance = json.accounts[index].balance + params.value;

      fs.writeFile(fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.send(json.accounts[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
});

module.exports = router;
