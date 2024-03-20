import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'// Ajusta la ruta al archivo correcto
import CopomexResource from 'App/Resource/CopomexResource';

export default class AdressController{
 /**
 * @swagger
 * /api/destino/{codigoPostal}:
 *   get:
 *     tags:
 *       - Destino
 *     summary: Info. de codigos postales
 *     parameters:
 *       - name: codigoPostal
 *         in: path
 *         required: true
 *         description: codigo postal
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success! Tout va bien :)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Titulo de la respuestinha sinha sinha
 *                 data:
 *                   type: string
 *                   description: datos de respuesta
 */
    public async postal({request, response}:HttpContextContract){
        const codigoPostal = request.param('codigoPostal')
        const res = await CopomexResource.codigo(codigoPostal)
        return response.status(200).send({
            res
        })
    }
}