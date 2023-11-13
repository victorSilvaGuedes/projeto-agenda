const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  validate() {
    this.cleanUp();
    if (this.body.name.length < 3 || this.body.name.length > 20)
      this.errors.push('O nome precisa ter de 3 a 20 caracteres!');

    if (!validator.isEmail(this.body.email))
      this.errors.push('O email é inválido!');

    if (this.body.password.length < 3 || this.body.password.length > 50)
      this.errors.push('A senha precisa ter de 3 a 50 caracteres!');
  }

  async register() {
    this.validate();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async login() {
    this.name = this.body.name;
    this.validate();
    if (this.errors.length > 0) return;
    this.user = await LoginModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário inválido!');
      return;
    }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida!');
      this.user = null;
      return;
    }
  }

  async userExists() {
    this.user = await LoginModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('O email já foi cadastrado!');
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      name: this.body.name,
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
