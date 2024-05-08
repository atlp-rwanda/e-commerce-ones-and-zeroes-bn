'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          userId: {
            allowNull: false;
            primaryKey: true;
            type: any;
            defaultValue: any;
          };
          firstName: { type: String; allowNull: false };
          lastName: { type: String; allowNull: false };
          email: { type: String; unique: true; allowNull: any };
          password: { type: String; allowNull: any };
          isActive: { type: Boolean; allowNull: any; defaultValue: false };
          use2FA: { type: Boolean; allowNull: any; defaultValue: false };
          isGoogle: { type: Boolean; allowNull: any; defaultValue: false };
          createdAt: { allowNull: boolean; type: any; defaultValue: any };
          updatedAt: { allowNull: boolean; type: any; defaultValue: any };
          secret: { type: String; allowNull: true };
        }
      ) => any;
    },
    Sequelize: {
      UUID: any;
      UUIDV4: any;
      STRING: any;
      DATE: any;
      BOOLEAN: any;
      literal: (arg0: string) => any;
    }
  ) {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isGoogle: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      secret: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      use2FA: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
         }
    });
  },

  async down(
    queryInterface: { dropTable: (arg0: string) => any },
    Sequelize: any
  ) {
    await queryInterface.dropTable("Users");
  },
};





// const userType = await db.UserType.findOne({ where: { userId: user.id, type: 'seller' } });
// if (!userType) {
//   return res.status(403).json({ message: 'You are not authorized to perform this action' });
// }