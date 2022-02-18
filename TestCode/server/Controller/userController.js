const router = require('express').Router();
const bcrypt = require('bcrypt');

const { User, validate } = require('../Models/User');
const sendEmail = require('../helper/sendMail');

/*
  API: create user
  Param: firstName, lastName, email, mobile, gender, dob, password,
*/
router.post('/', async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: 'User with given email already Exist!' });

    const hashPassword = await bcrypt.hash(req.body.password, 2);

    user = await new User({ ...req.body, password: hashPassword }).save();

    const url = `Email verification sent`;
    const mailResponse = await sendEmail(user.email, 'Verify email', url);
    if (mailResponse) {
      res.status(201).send({
        message:
          'Registration Successfully with mail send',
      });
    } else {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await User.findByIdAndDelete(req.params.id);
    if (data) {
      res.status(200).json({ success: 'User deleted successfully!' });
    } else {
      res.status(404).json({ success: 'User not found!' });
    }
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


router.put('/:id', async (req, res) => {
  try {
    const data = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ data });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
})



module.exports = router;