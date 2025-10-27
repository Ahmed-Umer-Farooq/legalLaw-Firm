const db = require('../db');

const getUnverifiedLawyers = async (req, res) => {
  try {
    const lawyers = await db('lawyers').where({ lawyer_verified: false }).select('id', 'name', 'email', 'registration_id', 'law_firm', 'speciality', 'address', 'zip_code', 'created_at');
    res.json(lawyers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await db('lawyers').where({ id }).first();
    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    await db('lawyers').where({ id }).update({ lawyer_verified: true });

    res.json({ message: 'Lawyer verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUnverifiedLawyers,
  verifyLawyer,
};
