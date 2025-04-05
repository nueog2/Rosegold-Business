const db = require('../../models');
const { Locker, LockerSlot } = db;
const ApiError = require('../utils/apiError');

class LockerController {
  // 보관함 생성
  async createLocker(req, res) {
    try {
      console.log('Request body:', req.body); // 요청 데이터 로깅

      const { hotel_id, total_slots } = req.body;

      // 필수 필드 검증
      if (!hotel_id || !total_slots) {
        return res.status(400).json({
          success: false,
          message: 'hotel_id와 total_slots는 필수 필드입니다.'
        });
      }

      // 이미 존재하는 보관함 확인
      const existingLocker = await Locker.findOne({
        where: {
          hotel_id: hotel_id
        }
      });

      if (existingLocker) {
        return res.status(400).json({
          success: false,
          message: '이미 보관함이 존재합니다'
        });
      }

      const locker = await Locker.create({
        hotel_id: hotel_id,
        total_slots: total_slots
      });

      // 보관함 칸 자동 생성
      const slots = Array.from({ length: total_slots }, (_, i) => ({
        locker_id: locker.id,
        slot_number: i + 1,
        type: 'key' // 기본값은 key로 설정
      }));

      await LockerSlot.bulkCreate(slots);

      res.status(201).json({
        success: true,
        message: `${total_slots}개의 보관함 칸이 생성되었습니다`,
        data: locker
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: '보관함 생성 중 오류가 발생했습니다'
      });
    }
  }

  // 보관함 칸 내용물 등록/수정
  async updateSlotContent(req, res) {
    try {
      const { slotId } = req.params;
      const { type, room_id, room_price, guest_name, item_name } = req.body;

      // 보관함 칸 존재 여부 확인 및 room 정보 함께 조회
      const slot = await LockerSlot.findByPk(slotId, {
        include: [{
          model: db.room,
          as: 'room',
          attributes: ['name'],
        }]
      });

      if (!slot) {
        return res.status(404).json({
          success: false,
          message: '보관함 칸을 찾을 수 없습니다'
        });
      }

      // 업데이트할 데이터 객체 생성
      const updateData = {};
      if (type) updateData.type = type;
      if (room_id) updateData.room_id = room_id;
      if (room_price) updateData.room_price = room_price;
      //여기 수정 필요함 0306
      if (guest_name) {
        updateData.guest_name = guest_name;
        updateData.checkin_status = 1; // 고객명이 있으면 예약 고객
      } else if (guest_name === "") {  // 고객명을 빈 문자열로 보내면 삭제
        updateData.guest_name = null;    // guest_name을 null 업데이트
        updateData.checkin_status = 0; // 미예약 고객 상태로 변경
      }
      if (item_name) updateData.item_name = item_name;

      // 데이터 업데이트
      await slot.update(updateData);

      // 업데이트된 데이터 다시 조회 (room 정보 포함)
      const updatedSlot = await LockerSlot.findByPk(slotId, {
        include: [{
          model: db.room,
          as: 'room',
          attributes: ['name'],
        }]
      });

      // 응답 데이터 구성
      const responseData = {
        id: updatedSlot.id,
        locker_id: updatedSlot.locker_id,
        slot_number: updatedSlot.slot_number,
        type: updatedSlot.type,
        room_number: updatedSlot.room ? updatedSlot.room.name : null, // 실제 객실 번호만 표시
        room_price: updatedSlot.room_price,
        guest_name: updatedSlot.guest_name,
        checkin_status: updatedSlot.checkin_status,
        createdAt: updatedSlot.createdAt,
        updatedAt: updatedSlot.updatedAt
      };

      res.status(200).json({
        success: true,
        message: '보관함 칸 내용물이 업데이트되었습니다',
        data: responseData
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        message: '내용물 업데이트 중 오류가 발생했습니다'
      });
    }
  }

  // 체크인 상태 업데이트
  async updateCheckinStatus(req, res) {
    const { slot_id } = req.params;
    const { status } = req.body;

    try {
      const slot = await LockerSlot.findByPk(slot_id);
      if (!slot) {
        throw new ApiError(404, '보관함 칸을 찾을 수 없습니다');
      }

      if (slot.type !== 'key') {
        throw new ApiError(400, '객실 키에 대해서만 상태를 변경할 수 있습니다');
      }

      await slot.update({ checkin_status: status });

      res.status(200).json({
        success: true,
        data: slot
      });
    } catch (error) {
      throw new ApiError(500, '상태 업데이트 중 오류가 발생했습니다');
    }
  }

  // 보관함 칸 내용물 삭제
  async clearSlotContent(req, res) {
    const { slot_id } = req.params;

    try {
      const slot = await LockerSlot.findByPk(slot_id);
      if (!slot) {
        throw new ApiError(404, '보관함 칸을 찾을 수 없습니다');
      }

      await slot.update({
        type: 'key',
        item_name: null,
        room_id: null,
        room_price: null,
        guest_name: null,
        checkin_status: null
      });

      res.status(200).json({
        success: true,
        message: '보관함 칸이 초기화되었습니다'
      });
    } catch (error) {
      throw new ApiError(500, '내용물 삭제 중 오류가 발생했습니다');
    }
  }

  // 예약 고객 보관함 전체 초기화
  async resetReservedSlots(req, res) {
    const { locker_id } = req.params;

    try {
      const updatedSlots = await LockerSlot.update(
        {
          type: 'key',
          item_name: null,
          room_id: null,
          room_price: null,
          guest_name: null,
          checkin_status: null
        },
        {
          where: {
            locker_id,
            guest_name: { [Op.ne]: null }
          }
        }
      );

      res.status(200).json({
        success: true,
        message: `${updatedSlots[0]}개의 보관함이 초기화되었습니다`
      });
    } catch (error) {
      throw new ApiError(500, '초기화 중 오류가 발생했습니다');
    }
  }
}

module.exports = new LockerController(); 