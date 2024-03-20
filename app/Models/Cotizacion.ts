import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Cliente from './Cliente'
import Destino from './Destino'
import Categoria from './Categoria'

export default class Cotizacion extends BaseModel {
  @column({ isPrimary: true })
  public id_cotizacion: number

  @column()
  public fk_cliente: number 
  // una categoria puede tenere muchas cotizacions osea que pueden ver varias cotizaciones con categorias de clase media
  @column()
  public fk_categoria: number

  @column()
  public fk_destino: number
  // distancia forzosamente en kilometros
  @column()
  public distancia: number

  @column()
  public precio: number

  @column()
  public status: string

  @column()
  public folio: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => Cliente, {
    foreignKey: 'fk_cliente',
    localKey: 'id_cliente'
  })
  public cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Destino,{
    foreignKey: 'fk_destino',
    localKey:'id_destino'
  })
  public destino: BelongsTo<typeof Destino>

  @belongsTo(() => Categoria,{
    foreignKey:'fk_categoria',
    localKey:'id_categoria'
  })
  public categoria: BelongsTo<typeof Categoria>
}
