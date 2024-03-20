import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Destino extends BaseModel {
  @column({ isPrimary: true })
  public id_destino: number

  @column()
  public pais: string
  @column()
  public ciudad: string
  @column()
  public estado: string
  @column()
  precio_distancia: string


  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime
}
