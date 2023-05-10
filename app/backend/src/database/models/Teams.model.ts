import { Model, DataTypes } from 'sequelize';
import db from '.';

class Team extends Model {
  public id!: number;
  public teamName!: string;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    underscored: true,
    sequelize: db,
    timestamps: false,
    modelName: 'team',
  },
);

export default Team;
