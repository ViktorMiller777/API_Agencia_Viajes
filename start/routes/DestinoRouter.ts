import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','DestinosController.index')
    Route.post('/','DestinosController.store')
    
}).prefix('/api/destino')