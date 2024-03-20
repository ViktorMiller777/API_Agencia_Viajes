import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    
    Route.get('/','AdministradoresController.index')
    Route.get('/:id_user','AdministradoresController.show')
    Route.post('/','AdministradoresController.store')
    Route.put('/:id_user','AdministradoresController.update')
    Route.delete('/:id_user','AdministradoresController.destroy')
    Route.post('/login','AdministradoresController.login')
    Route.post('/email/:id_user','AdministradoresController.sendMail')

}).prefix('/api/administrador')