import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Destino from 'App/Models/Destino'

export default class DestinosController {
  /**
 * @swagger
 * /api/destino:
 *   get:
 *     tags:
 *       - Destino
 *     summary: List destiny
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success! Todo va bien :D
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Titulo de la respuesta
 *                 data:
 *                   type: string
 *                   description: datos de respuesta
 */
  public async index({response}: HttpContextContract) {
    const data = await Destino.all()
    response.status(200).send({
      title: 'Success',
      messgae:'RESOURCES',
      data:data
    })
  }
  /**
  * @swagger
  * /api/destino:
  *   post:
  *     tags:
  *       - Destino
  *     summary: Create destino
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               estado:
  *                 type: string
  *                 description: estado
  *               ciudad: 
  *                 type: string
  *                 description: ciudad
  *     responses:
  *       200:
  *         description: Success! Tout va bien :)
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 name:
  *                   type: string
  *                   description: Titulo de la respuestinha sinha sinha
  *                 last_name:
  *                   type: string
  *                   description: datos de respuesta
  */ 
  public async store({response, request}: HttpContextContract){
    const {ciudad, estado} = request.body()
    const destiny = new Destino()
    destiny.pais = 'Mexico'
    destiny.ciudad = ciudad
    destiny.estado = estado
    destiny.precio_distancia = '200$ x Kilometro'

    await destiny.save();

    return response.status(200).send({
      title:'Success',
      message:'Destiny created',
      data: destiny
    })
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
