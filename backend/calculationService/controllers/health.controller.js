/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check for Basic Service API
 */

const health = (req,res) => {
    res.send({'health': 'OK'})
}

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Get health report
 *     tags: [Health]
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               
 *       '500':
 *         description: Internal Server Error
 */


module.exports = { health }