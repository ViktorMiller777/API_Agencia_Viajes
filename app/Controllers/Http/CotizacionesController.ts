import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cotizacion from 'App/Models/Cotizacion';
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class CotizacionesController {
  private folio() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return random.toString();
  }
  /**
 * @swagger
 * /api/cotizacion:
 *  get:
 *    security:
 *      - bearerAut: []
 *    tags:
 *      - Cotizacion
 *    summary: Resourse quotes
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success!! :D
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Titulo de la respuesta
 *                data:
 *                  type: string
 *                  description: datos de respuesta
 */
  public async index({response}: HttpContextContract){
    const cotizacion = await Cotizacion.all()

    return response.status(200).send({
      title:'Success',
      message:'Resource found',
      data: cotizacion
    })
  }
  /**
  * @swagger
  * /api/cotizacion:
  *   post:
  *     tags:
  *       - Cotizacion
  *     summary: Cotizacion
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               fk_cliente:
  *                 type: number
  *                 description: foreign key employe
  *               fk_categoria:
  *                 type: number
  *                 description: foreign key categorie
  *               fk_destino:
  *                 type: number
  *                 description: foreign key destiny
  *               distancia:
  *                 type: number
  *                 description: distance
  *     responses:
  *       200:
  *         description: Success! Tout va bien :)
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 fk_cliente:
  *                   type: number
  *                   description: foreign key employe
  *                 fk_categoria:
  *                   type: number
  *                   description: foreign key categorie
  *                 distancia:
  *                   type: number
  *                   description: distance
  */ 
  public async store({request, response}: HttpContextContract){
    const {fk_cliente, fk_categoria, fk_destino, distancia}= request.body();

    const costokm = 200;
    let costo_total = distancia * costokm;
    const num = this.folio();

    const cotizacion = new Cotizacion()
    cotizacion.fk_cliente = fk_cliente
    cotizacion.fk_categoria = fk_categoria
    cotizacion.fk_destino = fk_destino
    cotizacion.distancia = distancia
    cotizacion.precio = costo_total
    cotizacion.status = 'sin_aprobar'
    cotizacion.folio = 'F' + num
  

    await cotizacion.save()

    return response.status(200).send({
      title:'Success',
      message:'Resource created',
      data: cotizacion
    })
  }
  /**
 * @swagger
 * /api/cotizacion/{id_cotizacion}:
 *   delete:
 *     tags:
 *       - Cotizacion
 *     summary: Delete quote
 *     parameters:
 *       - name: id_cotizacion
 *         in: path
 *         required: true
 *         description: Id
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
  public async destroy({params, response}: HttpContextContract){
    try {
      const cotizacion = await Cotizacion.findOrFail(params.id_cotizacion)
      await cotizacion.delete()
      return response.status(200).send({
        title: 'Success',
        mesagge:'Quote deleted successfuly :D',
        data: cotizacion
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(500).send({
          title:'ERROR',
          message:'Resource no fouuuundd aaaa >:O'
        })
      }
    }

  }
  // public async editarCancelar({request, params}: HttpContextContract){
  //   const {status} = request.body()
  //   const coti = await Cotizacion.findOrFail(params.id_cotizacion)
  // }
  /**
 * @swagger
 * /api/cotizacion/{id_cotizacion}:
 *   put:
 *     tags:
 *       - Cotizacion
 *     summary: Approve quote
 *     parameters:
 *       - name: id_cotizacion
 *         in: path
 *         required: true
 *         description: Id quote
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
  public async AuthorizedQuote({params, response}: HttpContextContract){
    //al aprobar este quote se le manda un mail a willy
    try {
      const cotizacion = await Cotizacion.query()
      .where('id_cotizacion', params.id_cotizacion)
      .preload('cliente')
      .preload('destino')
      .preload('categoria')
      .firstOrFail()

      const pais = cotizacion.destino.pais
      const estado = cotizacion.destino.estado
      const ciudad = cotizacion.destino.ciudad

      const categoria = cotizacion.categoria.categoria
      const descuento = cotizacion.categoria.descuento
      


      const distancia = cotizacion.distancia
      const folio = cotizacion.folio
      const precio = cotizacion.precio 

      const sum = descuento * precio

      const precioTotal = precio + sum

      const cot = cotizacion.status = 'aprovada'
      const correo =  'willvardo@gmail.com'
      await cotizacion.save()

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      await Mail.send((message)=>{
        message
        .from(Env.get('SMTP_USERNAME'), 'COTIZACION!')
        .to(correo)
        .subject(`COTIZACION DE TU VIAJE!!`)
        .htmlView('emails/welcome',{cot,precio,folio, distancia, pais, ciudad, estado, categoria, precioTotal})
      })

      return response.status(200).send({
        title:'Success',
        message:'Quote authorized!!',
        data: cotizacion
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error',
          message:'Quote no found.'
        })
      }
    }
  }
}//pa que no se vaya
