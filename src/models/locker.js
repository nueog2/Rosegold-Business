//주서린 250306
const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  // 보관함 모델
  const Locker = sequelize.define('Locker', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hotel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'hotels',
        key: 'id'
      }
    },
    total_slots: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'lockers',
    underscored: true,
    paranoid: true
  });

  // 보관함 칸 모델
  const LockerSlot = sequelize.define('LockerSlot', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    locker_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slot_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('key', 'item'),
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rooms',
        key: 'id'
      }
    },
    room_price: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    guest_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    checkin_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'locker_slots',
    underscored: true,
    paranoid: true
  });

  // 관계 설정
  Locker.hasMany(LockerSlot, {
    foreignKey: 'locker_id'
  });
  LockerSlot.belongsTo(Locker, {
    foreignKey: 'locker_id'
  });

  LockerSlot.belongsTo(sequelize.models.room, {
    foreignKey: 'room_id',
    as: 'room'
  });

  return { Locker, LockerSlot };
}; 