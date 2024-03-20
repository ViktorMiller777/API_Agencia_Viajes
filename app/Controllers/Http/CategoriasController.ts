import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Categoria from 'App/Models/Categoria'

export default class CategoriasController {
 /**
 * @swagger
 * /api/categoria:
 *   get:
 *     tags:
 *       - Categoria
 *     summary: Categories resource
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success all is good :)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Title response
 *                 data:
 *                   type: string
 *                   description: Data response
 */
  public async index({response}: HttpContextContract){
    const categorias = await Categoria.all();
    return response.status(200).send({
      title:'Success',
      message:'Resource found successfuly',
      data: categorias
    })
  }
  /**
  * @swagger
  * /api/categoria:
  *   post:
  *     tags:
  *       - Categoria
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
  *               categoria:
  *                 type: string
  *                 description: categorie
  *               descuento: 
  *                 type: number
  *                 description: discount
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
    const {categoria, descuento} = request.body()
    const cat = new Categoria()
    cat.categoria = categoria
    cat.descuento = descuento
    await cat.save()
    return response.status(200).send({
      title:'Success',
      message:'Resource categorie created',
      data: cat
    })
  }
 /**
 * @swagger
 * /api/categoria/{id_categoria}:
 *   put:
 *     tags:
 *       - Categoria
 *     summary: Update categories
 *     parameters:
 *       - name: id_categoria
 *         in: path
 *         required: true
 *         description: Id of categorie
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     requestBody:
 *       response: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoria:
 *                 type: string
 *                 description: Categorie
 *               descuento:
 *                 type: number
 *                 description: Discount
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
 *                   description: Title response!
 *                 data:
 *                   type: string
 *                   description: Data response!
 */
  public async update({response,params, request}: HttpContextContract){
    try {
      const { categoria, descuento } = request.body();
      const cat = await Categoria.findOrFail(params.id_categoria);
      cat.categoria = categoria
      cat.descuento = descuento
      await cat.save()
      return response.status(200).send({
        title: 'Succes',
        message: 'Resource categorie updated',
        data: cat
      })
    } catch (error) {
      if(error.code==='E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error :c',
          message:'Resource no found :c'
        })
      }
    }
  }
  /**
 * @swagger
 * /api/categoria/{id_categoria}:
 *   delete:
 *     tags:
 *       - Categoria
 *     summary: Delete categorie
 *     parameters:
 *       - name: id_categoria
 *         in: path
 *         required: true
 *         description: Id categorie
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
  public async destroy({response, params}: HttpContextContract){
    try {
      const cat = await Categoria.findOrFail(params.id_categoria)
      await cat.delete()
      return response.status(200).send({
        title:'Success',
        messgae:'Resource deleted',
        data:cat
      }) 
    } catch (error) {
      if(error.code = 'E_ROW_NOT_FOUND'){
        return response.status(200).send({
          title:'Error :c',
          message:'Resource no found'
        })
      }
    }
  }
}
