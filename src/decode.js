import num2char from "./num2char.json";

// // Binary to latitude and longitude (letter)
function bit2coordinate(bitLongitude, bitLatitude) {
  let longitude = bit2degree(bitLongitude.slice(1), "coordinate");
  let latitude = bit2degree(bitLatitude.slice(1), "coordinate");
  if (bitLongitude.slice(0, 1) === "0") {
    longitude = "E " + longitude;
  } else if (bitLongitude.slice(0, 1) === "1") {
    longitude = "W " + longitude;
  }
  if (bitLatitude.slice(0, 1) === "0") {
    latitude = "N " + latitude;
  } else if (bitLatitude.slice(0, 1) === "1") {
    latitude = "S " + latitude;
  }
  let coordinate = {
    longitude,
    latitude
  };
  return coordinate;
}

// Binary latitude and longitude (data for map analysis)
function bit2MapCoordinate(bitLongitude, bitLatitude) {
  let longitude = parseInt(bitLongitude, 2);
  let latitude = parseInt(bitLatitude, 2);
  if (bitLongitude.slice(0, 1) === "0") {
    longitude = longitude / 10000 / 60;
  } else if (bitLongitude.slice(0, 1) === "1") {
    longitude = -longitude / 10000 / 60;
  }
  if (bitLatitude.slice(0, 1) === "0") {
    latitude = +latitude / 10000 / 60;
  } else if (bitLatitude.slice(0, 1) === "1") {
    latitude = -latitude / 10000 / 60;
  }
  let coordinate = [longitude, latitude];
  return coordinate;
}

// Binary rotation
function bit2degree(bit, type) {
  let origin = parseInt(bit, 2);
  let result = "";
  if (type === "coordinate") {
    // If it is latitude and longitude coordinates
    origin = origin / 10000;
    let degree = parseInt(origin / 60);
    let minute = (origin % 60).toFixed(4);
    result = degree + "°" + minute + "′";
  } else if (type === "cog") {
    // If Heading
    result = origin / 10 + "°";
  } else if (type === "heading") {
    // If it is the actual bow direction
    result = origin + "°";
  }
  return result;
}

// Message ID message classification
function classifyID(id, bitMessage) {
  let type = "";
  switch (id) {
    case 1:
    case 2:
    case 3:
      type = positionReport(bitMessage);
      break;
    case 4:
      type = "Base station report";
      break;
    case 5:
      type = "Static and navigation related data";
      break;
    case 10:
      type = "UTC/Date Inquiry";
      break;
    case 11:
      type = "申请安全相关信息";
      break;
    case 12:
      type = safeConfirm(bitMessage);
      break;
    case 13:
      type = "Safety related broadcast message";
      break;
    default:
      type = "No Such Information";
  }
  return type;
}

// 转发指示符
function classifyIndicator(indicator) {
  let type = "";
  if (indicator === 0) {
    type = "Default";
  } else if (indicator === 3) {
    type = "No longer forward";
  } else {
    type = "Forwarded" + indicator + "times";
  }
  return type;
}

// 导航状态分类
function classifyNaviStatus(naviStatus) {
  let type = "";
  switch (naviStatus) {
    case 0:
      type = "Under way using Engine";
      break;
    case 1:
      type = "At anchor";
      break;
    case 2:
      type = "Not under command";
      break;
    case 3:
      type = "Restricted maneuverability";
      break;
    case 4:
      type = "Constrained by her draught";
      break;
    case 5:
      type = "Moored";
      break;
    case 6:
      type = "Aground";
      break;
    case 7:
      type = "Engaged in fishing";
      break;
    case 8:
      type = "Under way sailing";
      break;
    case 9:
      type =
        "Reserved for future correction of navigation status for ships carrying dangerous goods (DG), hazardous substances (HS) or marine pollutants (MP), or carrying IMO Class C dangerous goods or pollutants, high-speed ships (HSC)";
      break;
    case 10:
      type =
        "Reserved for future amendment of navigational status for ships carrying dangerous goods (DG), harmful substances (HS) or marine pollutants (MP), or IMO hazard or pollutant category A, wing in ground (WIG)";
      break;
    case 11:
    case 12:
    case 13:
      type = "Reserved for future use";
      break;
    case 14:
      type = "AIS-SART（Search and Rescue Radar Transponder）（现行的）";
      break;
    case 15:
      type = "Default";
      break;
    default:
      type = "No Info";
  }
  return type;
}

// Position Accuracy
function classifyAccuracy(accuracy) {
  let type = "";
  if (accuracy === "0") {
    type = "Low(>10m)";
  } else {
    type = "High(<10m)";
  }
  return type;
}

// Timestamp classification
function classifySecond(second) {
  let type = "";
  if (second < 60) {
    type = second + " seconds past the minute";
  } else if (second === 60) {
    type = "Unavailable";
  } else if (second === 61) {
    type = "Positioning system in manual input mode";
  } else if (second === 62) {
    type =
      "Electronic positioning system works in estimation (track estimation) mode";
  } else if (second === 63) {
    type = "Positioning system does not work";
  }
  return type;
}

// Specific manipulation indicator
function classifyRegionalApplication(regionalApplication) {
  let type = "";
  if (regionalApplication === 0) {
    type = "Unavailable";
  } else if (regionalApplication === 1) {
    type = "No specific manipulation";
  } else if (regionalApplication === 2) {
    type = "Perform specific manipulations";
  }
  return type;
}

// spare
function classifySpare(spare) {
  let type = "";
  if (spare === 0) {
    type = "Unused";
  }
  return type;
}

// RAIM Sign
function classifyRAIM(RAIM) {
  let type = "";
  if (RAIM === 0) {
    type = "RAIM not used";
  } else if (RAIM === 1) {
    type = "RAIM is in use";
  }
  return type;
}

// 通信状态
function classifyCommunicationState(id, cState) {
  let type = "";
  let cTimeType = "";
  let cTimeInfo = "";
  if (id === 1) {
    type = "SOTDMA";
  } else if (id === 2) {
    type = "SOTDMA";
  } else if (id === 3) {
    type = "ITDMA";
  }
  if (cState.slice(0, 2) === "00") {
    cTimeType = "UTC";
    let cTime = new Date();
    cTime.setHours(parseInt(cState.slice(5, 10), 2));
    cTime.setMinutes(parseInt(cState.slice(10, 17), 2));
    cTimeInfo = cTime.getHours() + ":" + cTime.getMinutes();
  }
  if (cState.slice(2, 5) === "000") {
    // means that this was the last transmission in the slot
  }
  type = type + " " + cTimeInfo + " " + cTimeType;
  return type;
}

// Decoding Package Information: Ship Position Report
function positionReport(bitMessage) {
  let info = {};
  let id = parseInt(bitMessage.slice(0, 6), 2); // Identifier for this message

  let indicator = parseInt(bitMessage.slice(6, 8), 2); // Repeat Indicator, 0 = default
  let indicatorType = classifyIndicator(indicator);

  let MMSI = parseInt(bitMessage.slice(8, 38), 2); // MMSI

  let naviStatus = parseInt(bitMessage.slice(38, 42), 2); // Navigational staus,0000=underway using engine
  let naviStatusType = classifyNaviStatus(naviStatus);

  let rate = 4.733 * Math.sqrt(parseInt(bitMessage.slice(42, 50), 2)) + "°/min"; // Rate of turn，00000000=0

  let sog = parseInt(bitMessage.slice(50, 60), 2) / 10 + " section"; // Speed over ground，0000000000 = 0

  let accuracy = parseInt(bitMessage.slice(60, 61), 2); // Position accuracy, 0=LOW
  let accuracyType = classifyAccuracy(accuracy);

  let coordinate = bit2coordinate(
    bitMessage.slice(61, 89),
    bitMessage.slice(89, 116)
  ); // Longitude & Latitude in 1/10000 minutes
  let coordinateData = bit2MapCoordinate(
    bitMessage.slice(61, 89),
    bitMessage.slice(89, 116)
  );
  let coordinateInfo = coordinate.longitude + " , " + coordinate.latitude;

  let cog = bit2degree(bitMessage.slice(116, 128), "cog"); // Course over ground 对地航向
  let heading = bit2degree(bitMessage.slice(128, 137), "heading"); // True Heading 实际航向

  let second = parseInt(bitMessage.slice(137, 143), 2); // UTC second when report, 010010 = 18 seconds past the minute;
  let secondType = classifySecond(second);

  let regionalApplication = parseInt(bitMessage.slice(143, 145), 2); // Regional Application, 0000 = no regional application
  let regionalApplicationType = classifyRegionalApplication(
    regionalApplication
  );

  let spare = parseInt(bitMessage.slice(145, 148), 2); // Spare
  let spareType = classifySpare(spare);

  let RAIM = parseInt(bitMessage.slice(148, 149), 2); // RAIM Flag, 0 = RAIM not in use
  let RAIMType = classifyRAIM(RAIM);

  let cState = bitMessage.slice(149, 168); // communications State, 0 = RAIM not in use, bits 167-168 not used for UTC Sub-message
  let cStateType = classifyCommunicationState(id, cState);

  info = {
    MessageID: {
      name: "MessageID",
      data: id,
      info: "Ship Position Report"
    },
    DataIndicator: {
      name: "Forward Indicator",
      data: indicator,
      info: indicatorType
    },
    UserID: {
      name: "UserID(MMSI)",
      data: MMSI,
      info: MMSI
    },
    NaviStatus: {
      name: "NavStatus",
      data: naviStatus,
      info: naviStatusType
    },
    ROT: {
      name: "ROT",
      data: rate,
      info: rate
    },
    SOG: {
      name: "SOG",
      data: sog,
      info: sog
    },
    Accuracy: {
      name: "Accuracy",
      data: accuracy,
      info: accuracyType
    },
    Location: {
      name: "Coordinate",
      data: coordinateData,
      info: coordinateInfo
    },
    COG: {
      name: "COG",
      data: cog,
      info: cog
    },
    Heading: {
      name: "HDT",
      data: heading,
      info: heading
    },
    Second: {
      name: "timestamp",
      data: second,
      info: secondType
    },
    RegionalApplication: {
      name: "specific indicator",
      data: regionalApplication,
      info: regionalApplicationType
    },
    Spare: {
      name: "spare",
      data: spare,
      info: spareType
    },
    RAIM: {
      name: "RAIM",
      data: RAIM,
      info: RAIMType
    },
    CommunicationState: {
      name: "CommStatus",
      data: cState,
      info: cStateType
    }
  };
  return info;
}

// Retransmission flag
function classifyRepeatFlag(RepeatFlag) {
  let type = "";
  if (RepeatFlag === 0) {
    type = "No duplicate sending";
  } else if (RepeatFlag === 1) {
    type = "Resend";
  }
  return type;
}

// Safety Related Text （Use 6 bit ASCII code）
function classifySecureText(SecureText) {
  let text = "";
  for (let i = 0; i < SecureText.length; i = i + 6) {
    text = text + num2char[parseInt(SecureText.substr(i, 6), 2)];
  }
  return text;
}

// Code decoding package information: safety related confirmation information
function safeConfirm(bitMessage) {
  let info = {};
  let id = parseInt(bitMessage.slice(0, 6), 2); // Identifier for this message

  let indicator = parseInt(bitMessage.slice(6, 8), 2); // Repeat Indicator, 0 = default
  let indicatorType = classifyIndicator(indicator);

  let SourceID = parseInt(bitMessage.slice(8, 38), 2); // MMSI

  let SerialNo = parseInt(bitMessage.slice(38, 40), 2); // 序列编号

  let DestID = parseInt(bitMessage.slice(40, 70), 2); // MMSI

  let RepeatFlag = parseInt(bitMessage.slice(70, 71), 2); // 重发标志
  let RepeatFlagType = classifyRepeatFlag(RepeatFlag);

  let spare = parseInt(bitMessage.slice(71, 72), 2); // 备用
  let spareType = classifySpare(spare);

  let SecureText = bitMessage.slice(72); // 安全相关文本
  let SecureTextInfo = classifySecureText(SecureText);

  info = {
    MessageID: {
      name: "MessageID",
      data: id,
      info: "Safety related confirmation"
    },
    DataIndicator: {
      name: "Forward Indicator",
      data: indicator,
      info: indicatorType
    },
    SourceID: {
      name: "SourceID",
      data: SourceID,
      info: SourceID
    },
    SerialID: {
      name: "SerialID",
      data: SerialNo,
      info: SerialNo
    },
    DestinationID: {
      name: "DestinationID",
      data: DestID,
      info: DestID
    },
    RepeatFlag: {
      name: "Repeat Flag",
      data: RepeatFlag,
      info: RepeatFlagType
    },
    Spare: {
      name: "Spare",
      data: spare,
      info: spareType
    },
    SecureText: {
      name: "SecureText",
      data: SecureText,
      info: SecureTextInfo
    }
  };
  return info;
}

// Decode package information
export function decodeMessage(bitMessage) {
  let info = {};
  let id = parseInt(bitMessage.slice(0, 6), 2); // Identifier for this message
  info = classifyID(id, bitMessage); // Sort messages for different processing
  return info;
}
