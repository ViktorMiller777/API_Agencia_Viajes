import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{

    Route.get('/:codigoPostal','AdressController.postal')

}).prefix('/api/destino')