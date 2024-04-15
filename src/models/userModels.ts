import { DataTypes, Model } from "sequelize";
import sequelize from "sequelize/lib/sequelize";



class User extends Model 
  
{
  public id!: string;

  public firstName!: string;

  public lastName!: string;

  public email!: string;

  public password!: string;

  public phone!: string;

 

  public verified!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      
      
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
  
    
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    timestamps: true,
    sequelize: sequelize,
    tableName: "users"
  }
);

export default User;