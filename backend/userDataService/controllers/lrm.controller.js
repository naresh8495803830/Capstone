const Lrm = require('../models/lrm.model').Lrm;

const addLrm = async (req, res) => {
    try {
        const { name, email, phoneNo, batchId } = req.body;
        const existingLrm = await Lrm.findOne({ email });
        if (existingLrm) {
            return res.status(400).json({ message: 'Lrm is already registered' });
        }
        const newLrm = new Lrm({ name, email, phoneNo, batchId });
        const savedLrm = await newLrm.save();
        res.status(201).json(savedLrm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllLrms = async (req, res) => {
    try {
        const lrms = await Lrm.find();
        res.json(lrms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLrmById = async (req, res) => {
    try {
        const lrm = await Lrm.findById(req.params.id);
        if (!lrm) {
            return res.status(404).json({ message: 'LRM not found' });
        }
        res.json(lrm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLrm = async (req, res) => {
    try {
        const { name, email, phoneNo } = req.body;
        const updatedLrm = await Lrm.findByIdAndUpdate(
            req.params.id,
            { name, email, phoneNo },
            { new: true }
        );
        if (!updatedLrm) {
            return res.status(404).json({ message: 'LRM not found' });
        }
        res.json(updatedLrm);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteLrm = async (req, res) => {
    try {
        const deletedLrm = await Lrm.findByIdAndDelete(req.params.id);
        if (!deletedLrm) {
            return res.status(404).json({ message: 'LRM not found' });
        }
        res.json(deletedLrm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addLrm, getAllLrms, getLrmById, updateLrm, deleteLrm}