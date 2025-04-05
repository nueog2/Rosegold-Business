const express = require('express');
const router = express.Router();
const lockerController = require('../controllers/lockerController');

// 보관함 생성
router.post('/lockers', lockerController.createLocker);

// 보관함 칸 내용물 등록/수정
router.put('/slots/:slotId', lockerController.updateSlotContent);

// 체크인 상태 업데이트
router.patch('/slots/:slotId/status', lockerController.updateCheckinStatus);

// 보관함 칸 내용물 삭제
router.delete('/slots/:slotId', lockerController.clearSlotContent);

// 예약 고객 보관함 전체 초기화
router.post('/lockers/:lockerId/reset-reserved', lockerController.resetReservedSlots);

module.exports = router; 