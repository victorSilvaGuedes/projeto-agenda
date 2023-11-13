const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  surname: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telephone: { type: String, required: false, default: '' },
  createdIn: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;
  }

  async register() {
    this.validate();

    if (this.errors.length > 0) return;

    this.contato = await ContactModel.create(this.body);
  }

  validate() {
    this.cleanUp();
    if (!this.body.name) this.errors.push('Nome é um campo obrigatório!');

    if (this.body.email && !validator.isEmail(this.body.email))
      this.errors.push('O email é inválido!');

    if (!this.body.telephone && !this.body.email)
      this.errors.push('Pelo menos um contato precisa ser preenchido: email ou telefone!');
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }
    this.body = {
      name: this.body.name,
      surname: this.body.surname,
      email: this.body.email,
      telephone: this.body.telephone,
    };
  }
}

module.exports = Contact;
