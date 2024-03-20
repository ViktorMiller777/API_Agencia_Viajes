import { DateTime } from 'luxon'
import { BaseModel, belongsTo,BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cotizacion from './Cotizacion'

export default class Cliente extends BaseModel {
  @column({ isPrimary: true })
  public id_cliente: number
  @column()
  public nombre: string
  @column()
  public apellido: string
  @column()
  public telefono: number
  @column()
  public correo: string
  @column()
  public codigo_verificacion: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Cotizacion, {
    foreignKey: 'fk_cliente', 
  })
  public clientes: BelongsTo<typeof Cotizacion>
}
