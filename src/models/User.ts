import { AutoIncrement, Column, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table
export default class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id!: number;

  @Unique
  @Column
  public snowflake!: string;

  @Default(0)
  @Column
  public xp!: number;

  @Default(1)
  @Column
  public level!: number;

  @Default(0)
  @Column
  public messages!: number;
}
