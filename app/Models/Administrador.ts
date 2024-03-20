import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class Administrador extends BaseModel {
  @column({ isPrimary: true })
  public id_user: number
  @column()
  public nombre: string
  @column()
  public apellido: string
  @column()
  public telefono: number
  @column()
  public correo: string

  @column({ serializeAs: null })
  public contrasena: string

  @column()
  public codigo_verificacion: string

  @beforeSave()
  public static async hashPassword(administrador: Administrador) {
    if (administrador.$dirty.contrasena) {
      administrador.contrasena = await Hash.make(administrador.contrasena)
    }
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}


