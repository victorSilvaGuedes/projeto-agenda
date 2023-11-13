const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
  res.render('contact', { contact: {} });
};

exports.register = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.register();

    if (contact.errors.length > 0) {
      req.flash('errors', contact.errors);
      req.session.save(function () {
        return res.redirect('/contact');
      });
      return;
    }

    req.flash('success', 'Contato registrado!');
    req.session.save(function () {
      return res.redirect(`/contact/${contact.contact._id}`);
    });
    return;
  } catch (error) {
    console.log(error);
    return res.render('404');
  }
};

exports.editContact = async function (req, res) {
  if (!req.params.id) return res.render('404');

  const contact = await new Contact().searchId(req.params.id);

  if (!contact) return res.render('404');

  res.render('contact', { contact });
};
