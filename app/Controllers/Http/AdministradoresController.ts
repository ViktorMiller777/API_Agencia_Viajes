import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Administrador from 'App/Models/Administrador';
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail';
import Env from '@ioc:Adonis/Core/Env'

export default class AdministradoresController {
  private CodigoVerificacion() {
    const random = Math.floor(1000 + Math.random() * 9000);
    return random.toString();
  }
  /**
 * @swagger
 * /api/administrador:
 *   get:
 *     tags:
 *       - Administrador
 *     summary: Lista de administradores
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
  public async index({response}: HttpContextContract){
    const admin = await Administrador.all()
    return response.status(200).send({
      title:'Success',
      message:'Lista de administradores',
      data:admin
    })
  }
  /**
  * @swagger
  * /api/administrador:
  *   post:
  *     tags:
  *       - Administrador
  *     summary: Create new admin
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
  *                 description: nombre del admin
  *               apellido:
  *                 type: string
  *                 description: apellido del admin
  *               telefono: 
  *                 type: number
  *                 description: telefono del admin
  *               correo: 
  *                 type: string
  *                 description: correo del admin
  *               contrasena: 
  *                 type: string
  *                 description: contraseña del admin
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
  public async store({request, response}: HttpContextContract) {
    const {nombre, apellido, telefono, correo, contrasena} = request.body();
    const admin = new Administrador();
    admin.nombre = nombre;
    admin.apellido = apellido;
    admin.telefono = telefono;
    admin.correo = correo;
    admin.contrasena = contrasena;
    const codigo = this.CodigoVerificacion();
    admin.codigo_verificacion = codigo;


    const administrador = await Administrador.findBy('correo', correo);
    if ( administrador ) {
      return response.status(400).json({
        message: 'Error al crear usuario',
        error: 'Correo electrónico ya registrado',
      });
    }
  
    await admin.save()

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    await Mail.send((message)=>{
      message
      .from(Env.get('SMTP_USERNAME'), 'PAPU SEÑAL!!')
      .to(correo)
      .subject('REUNANSE PAPUUS!!')
      .htmlView('emails/welcome')
    })

    return response.status(200).send({
      titlte:'Success',
      message:'Nuevo administrador registrado',
      date: admin
    })
  }
 /**
 * @swagger
 * /api/administrador/{id_user}:
 *   get:
 *     tags:
 *       - Administrador
 *     summary: List user resources
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *         description: Id del admin
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
  public async show({response, params}: HttpContextContract){
    try {
      const admin = await Administrador.query().where('id_user',params.id_user).firstOrFail()
      return response.status(200).send({
        title:'Success',
        message:'Admin by id',
        data:admin
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error :,(',
          message:'Resource no found :S'
        })
      }
    }

  }
 /**
 * @swagger
 * /api/administrador/{id_user}:
 *   put:
 *     tags:
 *       - Administrador
 *     summary: Change password :D
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *     produces:
 *       - application/json
 *     requestBody:
 *       response: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrasena:
 *                 type: string
 *                 description: New password
 *               codigo_verificacion:
 *                 type: number
 *                 description: Codigo
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
  public async update({response,params, request}: HttpContextContract){
        //agregar aca que se mande un SMS o correo para recuperar contraseña//
    try {
      const {contrasena, codigo_verificacion} = request.body();
      const admin = await Administrador.findOrFail(params.id_user);
      const codigo = admin.codigo_verificacion
      const correo = admin.correo
      
      if(admin.codigo_verificacion == codigo_verificacion){
        admin.contrasena = contrasena
      
        await admin.save()
  
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        await Mail.send((message)=>{
          message
          .from(Env.get('SMTP_USERNAME'), 'Recuperacion de contraseña')
          .to(correo)
          .subject(`Se actualizo la contraseña`)
          .htmlView('emails/contrasena',{contrasena})
        })
  
        return response.status(200).send({
          title:'Success',
          message:'Password update',
          data: codigo
        })
  
      }
      return response.status(500).send({
        title:'Error',
        message:'Datos invalidos'
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error :C',
          message:'Resource no found :0'
        })
      }
    }
  }
 /**
 * @swagger
 * /api/administrador/{id_user}:
 *   delete:
 *     tags:
 *       - Administrador
 *     summary: Delete admin
 *     parameters:
 *       - name: id_user
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
      const admin = await Administrador.findOrFail(params.id_user)
      await admin.delete()
      return response.status(200).send({
        title:'Success',
        message:'Resource deleted',
        data:admin
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          title:'Error >:c',
          message:'Resource no found...'
        })
      }
    }

  }
  /**
  * @swagger
  * /api/administrador/login:
  *   post:
  *     tags:
  *       - Administrador
  *     summary: login user
  *     produces:
  *       - application/json 
  *     requestBody:
  *       response: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               correo:
  *                 type: string
  *                 description: email
  *               contrasena:
  *                 type: string
  *                 description:  password
  *     responses:
  *       200:
  *         description: Success! Tout va bien :)
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 email:
  *                   type: string
  *                   description: email
  *                 password:
  *                   type: string
  *                   description: constraseña
  */ 
  public async login({response, request, auth }: HttpContextContract) {
    const correo = request.input('correo');
    const plainPass = request.input('contrasena');

    const reUser = await Administrador.query()
    .where('correo', correo)
    .first();

    if (!reUser) {
      return response.status(401).send({
        title: 'Datos invalidos',
        message: 'El usuario y/o contraseña son invalidos',
        type: 'warning',
        data: {
          correo: correo,
          contrasena: plainPass,
        },
      });
    }
  
    const hashedPass = reUser.contrasena;
  
    if (!(await Hash.verify(hashedPass, plainPass))) {
      return response.status(401).send({
        title: 'Datos invalidos',
        message: 'El usuario y/o contraseña son invalidos',
        data: {
          correo: correo,
          contrasena: plainPass,
        },
      });
    }

    const token = await auth.use('api').generate(reUser, {
      expiresIn: '15min',
    });
  
    return response.status(200).send({
      title: 'Autenticación exitosa',
      message: 'El token de sesión se ha generado de manera exitosa',
      type: 'success',
      data: {
        token,
      },
    });
  }
  /**
  * @swagger
  * /api/administrador/email/{id_user}:
  *   post:
  *     tags:
  *       - Administrador
  *     summary: Send codigo de verificacion
  *     parameters:
  *       - name: id_user
  *         in: path
  *         required: true
  *         description: Id del admin
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
  *               correo:
  *                 type: string
  *                 description: email del usuario
  *     responses:
  *       200:
  *         description: Success! Tout va bien :)
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 email:
  *                   type: string
  *                   description: Titulo de la respuestinha sinha sinha
  */ 
  public async sendMail({request, response, params}: HttpContextContract){
    const admin = await Administrador.findOrFail(params.id_user)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const correo = request.input('correo')

    await Mail.send((message)=>{
      message
      .from(Env.get('SMTP_USERNAME'), 'Codigo de verificacion enviado')
      .to(correo)
      .subject(`Este es tu codigo de verificacion cuidalo con tu vida: ${admin.codigo_verificacion}`)
      .htmlView('emails/codigo')
    })
    return response.status(200).send({
      title: 'Codigo de verificacion enviado',
      data: 'Codigo:' + admin.codigo_verificacion
    })
  }
}
