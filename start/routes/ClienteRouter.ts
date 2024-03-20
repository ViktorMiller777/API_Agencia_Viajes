import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    
    Route.get('/','ClientesController.index')
    Route.get('/:id_cliente','ClientesController.show').middleware('auth:api')
    Route.post('/','ClientesController.store')
    Route.put('/:id_cliente','ClientesController.update')
    Route.delete('/:id_cliente','ClientesController.destroy')
    Route.post('/sms/:id_cliente','ClientesController.SMS')
}).prefix('/api/cliente')