import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Cliente from 'App/Models/Cliente'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail';

export default class ClientesController {
  private CodigoVerificacion() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return random.toString();
  }
 /**
 * @swagger
 * /api/cliente:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Cliente
 *    summary: Employes Resource
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success! Todo va bien :D
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
    const res = await Cliente.all()
    return response.status(200).send({
      title: 'Success',
      message: 'Si jalo :D',
      data: res
    });
  }
  /**
  * @swagger
  * /api/cliente:
  *   post:
  *     security:
  *       - bearerAuth: []
  *     tags:
  *       - Cliente
  *     summary: Create new cliente
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               nombre:
  *                 type: string
  *                 description: nombre
  *               apellido: 
  *                 type: string
  *                 description: apellido
  *               telefono:
  *                 type: number
  *                 description: telefono
  *               correo:
  *                 type: string
  *                 description: correo
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
  public async store({request, response}: HttpContextContract){
    const {nombre, apellido, telefono, correo} = request.body()

    const cliente = new Cliente()
    
    cliente.nombre = nombre
    cliente.apellido = apellido
    cliente.telefono = telefono
    cliente.correo = correo
    const codigo = this.CodigoVerificacion();
    cliente.codigo_verificacion = codigo;

    const administrador= await Cliente.findBy('correo', correo);
    if ( administrador ) {
      return response.status(400).json({
        message: 'Error al crear usuario',
        error: 'Correo electrónico ya registrado',
      });
    }

    await cliente.save()
    return response.status(200).send({
      title: 'Success',
      message: 'Create cliente successfuly',
      data: cliente
    })
  }
 /**
 * @swagger
 * /api/cliente/{id_cliente}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Cliente
 *    summary: Cliente by id
 *    parameters:
 *      - name: id_cliente
 *        in: path
 *        required: true
 *        description: id del cliente
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success! Tout va bien :)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Titulo de la respuestinha sinha sinha
 *                data:
 *                  type: string
 *                  description: datos de respuesta
 */
  public async show({params, response}: HttpContextContract){
    try {
      const cliente = await Cliente.query().where('id_cliente',params.id_cliente).firstOrFail()
      return response.status(200).send({
        title:'Success',
        message:'Cliente by id',
        data: cliente
      })
    } catch (error) {
      if(error.code="E_ROW_NOT_FOUND: Row not found"){
        return response.status(404).send({
          title:'Error!',
          message:'Resource no found :(' 
        })
      }
    }
  }
 /**
 * @swagger
 * /api/cliente/{id_cliente}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Cliente
 *    summary: Actualizar cliente
 *    parameters:
 *      - name: id_cliente
 *        in: path
 *        required: true
 *        description: Id del cliente
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    requestBody:
 *      response: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              telefono:
 *                type: number
 *                description: actualiza el telefono
 *              correo:
 *                type: string
 *                description: actualiza el correo
 *    responses:
 *      200:
 *        description: Success! Tout va bien :)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Titulo de la respuestinha sinha sinha
 *                data:
 *                  type: string
 *                  description: datos de respuesta
 */
  public async update({request,params,response}: HttpContextContract) {
    try {
      const {telefono, correo} = request.body()
      const cliente = await Cliente.findOrFail(params.id_cliente)
      cliente.telefono = telefono;
      cliente.correo  =correo
      const codigo = this.CodigoVerificacion();
      cliente.codigo_verificacion = codigo;
      await cliente.save()
      return response.status(200).send({
        title:'Success',
        message:'Resource update',
        data: cliente
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title: 'Error',
          message: 'cebolla pelon'
        })
      }
    }
  }
 /**
 * @swagger
 * /api/cliente/{id_cliente}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Cliente
 *    summary: borrar cliente
 *    parameters:
 *      - name: id_cliente
 *        in: path
 *        required: true
 *        description: Id del cliente
 *        schema:
 *          type: integer
 *    produces:
 *      - application/json
 *    responses:
 *      200:
 *        description: Success! Tout va bien :)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  description: Titulo de la respuestinha sinha sinha
 *                data:
 *                  type: string
 *                  description: datos de respuesta
 */
  public async destroy({params, response}: HttpContextContract){
    try {
      const cliente = await Cliente.findOrFail(params.id_cliente)
      await cliente.delete();
      return response.status(200).send({
       title:'Success',
       message:'Resource deleted',
       data: cliente
      })
    } catch(error) {
      if(error.code==='E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error',
          message:'NO found :c'
        })
      }else{
        return response.status(500).send({
          title:'Error',
          message:'YOU CANT DELET THIS RESOURCE CUZ'+ ' IS USAGE IN QUOTE'
        })
      }
    }
  }
  /**
   * @swagger
   * /api/cliente/sms/{id_cliente}:
   *  post:
   *    tags:
   *      - Cliente
   *    summary: Send SMS
   *    parameters:
   *      - name: id_cliente
   *        in:  path
   *        requiered: true
   *        description: Id client
   *        schema:
   *          type: number
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Success :)
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
   *                  description: datos :D  
   */
  public async SMS({ request}: HttpContextContract) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const correo = request.input('correo')
    await Mail.send((message)=>{
      message
      .from(Env.get('SMTP_USERNAME'), 'Codigo de verificacion')
      .to(correo)
      .subject('')
      .htmlView('emails/welcome')
    })
  }
}