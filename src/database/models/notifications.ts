'use strict';
const { Model } = require('sequelize');
module.exports = (
    sequelize: any,
    DataTypes: {
        UUID: any;
        UUIDV4: any;
        STRING: any;
        DECIMAL: any;
        BOOLEAN: any;
        ARRAY: any;
        DATE: any;
        INTEGER: any;
    },
) => {
    class Notifications extends Model {

    }
    Notifications.init(
        {
            notificationId: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },

            userId: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            subject: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            body: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            isRead: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },

            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: Date.now(),
            },
        },
        {
            sequelize,
            modelName: 'Notifications',
        },
    );
    return Notifications;
};
