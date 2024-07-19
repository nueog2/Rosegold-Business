const jwt = require("../modules/jwt");
const message = require("../../config/message");
const { Room, Message } = require("../models/hotel");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Role_Assign_Log = require("../models/hotel").Role_Assign_Log;
const Requirement_Log = require("../models/hotel").Requirement_Log;

const axios = require("axios");

exports.createHotelAuto = async (req, res) => {
  const hotel = new Hotel();
  // const hotelData = req.body;

  if (
    req.body.name == null ||
    req.body.contact_number == null ||
    req.body.address_sido == null ||
    req.body.address_sigungu == null ||
    req.body.address_other == null ||
    req.body.checkin_date == null ||
    req.body.checkout_date == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  try {
    const hotelResponse = await hotel.create(
      req.body.name,
      req.body.contact_number,
      req.body.address_sido,
      req.body.address_sigungu,
      req.body.address_other,
      req.body.checkin_date,
      req.body.checkout_date
    )((response) => {
      return res.status(response.status).send(response);
    });

    console.log("\n\nHOTEL CREATED: ", hotelResponse.hotel);

    const department = new Department();
    const departmentData = {
      dep_array: [
        {
          name: "프론트",
          token_name: "frontDesk",
          hotel_id: hotelResponse.hotel.id,
        },
        {
          name: "F&B",
          token_name: "F&B",
          hotel_id: hotelResponse.hotel.id,
        },
        {
          name: "시설팀",
          token_name: "facilty",
          hotel_id: hotelResponse.hotel.id,
        },
        {
          name: "안내팀",
          token_name: "concierge",
          hotel_id: hotelResponse.hotel.id,
        },
        {
          name: "하우스키핑",
          token_name: "housekeeping",
          hotel_id: hotelResponse.hotel.id,
        },
      ],
    };

    const departmentRes = await axios.post(
      "http://223.130.137.39:6060/api/hotel/department/",
      departmentData
    );

    console.log("\n\nDEPARTMENT CREATED: ", departmentRes.department);

    const departments = departmentRes.department;

    // const serviceCategoryData = departments.map((department, index) => ({
    //     name: departmentData.dep_array[index].name,
    //     eng_name: departmentData.dep_array[index].token_name,
    //     hotel_id: hotelResponse.hotel.id,
    //     department_id: department.id
    //   }));

    // const serviceCategoryRes = await axios.post("http://223.130.137.39:6060/api/hotel/service_category", { service_categories: serviceCategoryData });

    // console.log("SERVICE CATEGORIES CREATED: ", serviceCategoryRes.data);

    // return res.status(message["200_SUCCESS"].status).send({
    //   message: "Hotel, departments, and service categories created successfully",
    //   hotel: hotelResponse.hotel,
    //   departments: departments,
    //   service_categories: serviceCategoryRes.data,
    // });
  } catch (error) {
    console.error(error);
    return res
      .status(message["500_SERVER_INTERNAL_ERROR"].status)
      .send(
        message.issueMessage(
          message["500_SERVER_INTERNAL_ERROR"],
          "UNDEFINED_ERROR"
        )
      );
  }
};

// module.exports = { createHotelAuto };
