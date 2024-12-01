/**
 * @swagger
 * tags:
 *   name: Domains
 *   description: Domain operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Domain:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated ID of the domain
 *         domainName:
 *           type: string
 *           description: The name of the domain
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp of when the domain was created
 */

const Domain = require("../models/domain.model").Domain;

/**
 * @swagger
 * /domain:
 *   post:
 *     summary: Create a new domain
 *     tags: [Domains]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Domain Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Domain Created Successfully
 *       '400':
 *         description: Bad Request
 *       '409':
 *         description: Domain already exists
 *       '500':
 *         description: Internal Server Error
 */

const addDomain = async (req, res) => {
  try {
    let domain = await Domain.findOne({ domainName: req.body.domain });
    console.log("domain found: ", domain);
    if (!domain) {
      const domainDetail = new Domain({
        domainName: req.body.domain,
      });
      await domainDetail
        .save()
        .then((data) => {
          res.send({
            msg: "Domain Created Successfully!",
          });
        })
        .catch((err) => console.log(err));
    } else {
      res.send({ msg: "Domain already exists" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

/**
 * @swagger
 * /domain:
 *   get:
 *     summary: Get all domains
 *     tags: [Domains]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Domain'
 *       '500':
 *         description: Internal Server Error
 */

const getAllDomain = async (req, res) => {
  try {
    console.log(req.body);
    let domain = await Domain.find({});
    console.log(domain);
    if (domain) {
      res.send(domain);
    } else {
      res.send({ msg: "Domain doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Something went wrong" });
  }
};

/**
 * @swagger
 * /domain/{id}:
 *   get:
 *     summary: Get a domain by ID
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the domain
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Domain'
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */

const getDomainById = async (req, res) => {
  try {
    const domainId = req.params.id;

    const domain = await Domain.findById(domainId);

    if (domain) {
      res.send(domain);
    } else {
      res.status(404).send({ msg: "Domain not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /domain/{id}:
 *   put:
 *     summary: Update a domain by ID
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the domain
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domainName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Domain updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Domain updated successfully
 *                 domain:
 *                   $ref: '#/components/schemas/Domain'
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */

const updateDomain = async (req, res) => {
  try {
    const domainId = req.params.id;
    const { domainName } = req.body;

    if (!domainName) {
      return res
        .status(400)
        .json({ error: "DomainName is required for update." });
    }

    const updatedDomain = await Domain.findByIdAndUpdate(
      domainId,
      { domainName },
      { new: true }
    );

    if (updatedDomain) {
      res.send({ msg: "Domain updated successfully", domain: updatedDomain });
    } else {
      res.status(404).send({ msg: "Domain not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /domain/{id}:
 *   delete:
 *     summary: Delete a domain by ID
 *     tags: [Domains]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the domain
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Domain deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Domain deleted successfully
 *                 domain:
 *                   $ref: '#/components/schemas/Domain'
 *       '404':
 *         description: Domain not found
 *       '500':
 *         description: Internal Server Error
 */

const deleteDomain = async (req, res) => {
  try {
    const domainId = req.params.id;

    const deletedDomain = await Domain.findByIdAndDelete(domainId);

    if (deletedDomain) {
      res.send({ msg: "Domain deleted successfully", domain: deletedDomain });
    } else {
      res.status(404).send({ msg: "Domain not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

module.exports = {
  addDomain,
  getAllDomain,
  getDomainById,
  updateDomain,
  deleteDomain,
};
