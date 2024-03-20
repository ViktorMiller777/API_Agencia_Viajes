import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','CategoriasController.index')
    Route.post('/','CategoriasController.store')
    Route.put('/:id_categoria','CategoriasController.update')
    Route.delete('/:id_categoria','CategoriasController.destroy')
}).prefix('/api/categoria')