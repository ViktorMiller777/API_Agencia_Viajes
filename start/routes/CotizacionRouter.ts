import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.get('/','CotizacionesController.index')
    Route.post('/','CotizacionesController.store')
    Route.delete('/:id_cotizacion','CotizacionesController.destroy')
    Route.put('/:id_cotizacion','CotizacionesController.AuthorizedQuote')
}).prefix('/api/cotizacion')