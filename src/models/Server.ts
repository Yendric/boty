import { AllowNull, AutoIncrement, Column, Default, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

@Table
export default class Server extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
  public id!: number;

  @Unique
  @Column
  public guildId!: string;

  @Default(false)
  @Column
  public autoRoleEnabled!: boolean;

  @AllowNull
  @Column
  public autoRole!: string;

  @Default(false)
  @Column
  public welcomeMessageEnabled!: boolean;

  @Default("Welkom op {{server}}, {{naam}}")
  @Column
  public welcomeMessage!: string;

  @AllowNull
  @Column
  public welcomeMessageChannel!: string;

  @Default(false)
  @Column
  public goodbyeMessageEnabled!: boolean;

  @Default("Vaarwel, {{naam}}")
  @Column
  public goodbyeMessage!: string;

  @AllowNull
  @Column
  public goodbyeMessageChannel!: string;

  @Default(false)
  @Column
  public memesEnabled!: boolean;

  @AllowNull
  @Column
  public memesChannel!: string;

  @AllowNull
  @Column
  public adminRole!: string;
}
