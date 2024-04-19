import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

const Mapping = {
  0: "icon_36",
  1: "icon_3",
  2: "icon_2",
  3: "icon_3",
  4: "icon_4",
  5: "icon_5",
  6: "icon_6",
  7: "icon_7",
  8: "icon_8",
  9: "icon_9",
  10: "icon_10",
  11: "icon_11",
  12: "icon_12",
  13: "icon_13",
  14: "icon_14",
  15: "icon_15",
  16: "icon_16",
  17: "icon_17",
  18: "icon_18",
  19: "icon_19",
  20: "icon_20",
  21: "icon_21",
  22: "icon_22",
  23: "icon_23",
  24: "icon_24",
  25: "icon_25",
  26: "icon_26",
  27: "icon_27",
  28: "icon_28",
  29: "icon_29",
  30: "icon_30",
  31: "icon_31",
  32: "icon_32",
  33: "icon_33",
  34: "icon_34",
  35: "icon_35",
  36: "icon_36",
  37: "icon_37",
  38: "icon_38",
  39: "icon_39",
  40: "icon_40",
  41: "icon_41",
  42: "icon_42",
  43: "icon_43",
  44: "icon_44",
  45: "icon_45",
  46: "icon_46",
  47: "icon_47",
  48: "icon_48",
  49: "icon_49",
  50: "icon_50",
  51: "icon_51",
  52: "icon_52",
  53: "icon_53",
  54: "icon_54",
  55: "icon_55",
  56: "icon_56",
  57: "icon_57",
  58: "icon_58",
  59: "icon_59",
  60: "icon_60",
  61: "icon_61",
  62: "icon_62",
  63: "icon_63",
  64: "icon_64",
  65: "icon_65",
  66: "icon_66",
  67: "icon_67",
  68: "icon_68",
  69: "icon_69",
  70: "icon_70",
  71: "icon_71",
  72: "icon_72",
  73: "icon_73",
  74: "icon_74",
  75: "icon_75",
  76: "icon_76",
  77: "icon_77",
  78: "icon_78",
  79: "icon_79",
  80: "icon_80",
  81: "icon_81",
  82: "icon_82",
  83: "icon_83",
  84: "icon_84",
  85: "icon_85",
  86: "icon_86",
  87: "icon_87",
  88: "icon_88",
  89: "icon_89",
  90: "icon_90",
  91: "icon_91",
  92: "icon_92",
  93: "icon_93",
  94: "icon_94",
  95: "icon_95",
  96: "icon_96",
  97: "icon_97",
  98: "icon_98",
  99: "icon_99",
  100: "icon_100",
  101: "icon_101",
  102: "icon_102",
  103: "icon_103",
  104: "icon_104",
  105: "icon_105",
  106: "icon_106",
  107: "icon_107",
  108: "icon_108",
  109: "icon_109",
  110: "icon_110",
  111: "icon_111",
  112: "icon_112",
  113: "icon_113",
  114: "icon_114",
  115: "icon_115",
  116: "icon_116",
  117: "icon_117",
  118: "icon_118",
  119: "icon_119",
  120: "icon_120",
  121: "icon_121",
  122: "icon_122",
  123: "icon_123",
  124: "icon_124",
  125: "icon_125",
  126: "icon_126",
  127: "icon_127",
  128: "icon_128",
  129: "icon_129",

  star_fil: "icon_star_fil",
  star_out: "icon_star_out",
  calculator: "icon_calc",
  calculator_v2: "icon_calc_v2",
  settings: "icon_settings",
  settings_v2: "icon_settings_v2",
  angle_up: "icon_angle_up",
  angle_right: "icon_angle_up",
  angle_up: "icon_angle_up",
  angle_down: "icon_angle_down",
  angle_right: "icon_angle_right",
  angle_left: "icon_angle_left",
  stream: "icon_stream",
  info: "icon_info",
  boost: "icon_double",
  control_unchecked: "icon_control_unchecked",
  control_checked: "icon_control_checked",
};

const Variants = {
  300: "dg_icon_300",
  400: "dg_icon_400",
};

const sizeMapping = {
  sm: "dg_icon_xs", // Change these class names based on your actual CSS
  md: "dg_icon_s",
  lg: "",
};

const Symbol = ({ sportId, variant, size = "lg", className }) => {
  const iconClassName = Mapping[sportId] || "icon_36";
  const iconVariantClassName = Variants[variant] || "dg_icon_400";
  const iconSizeClassName = sizeMapping[size];
  const ViewClassName = classNames({
    dg_icon: true,
    [iconClassName]: true,
    [iconVariantClassName]: true,
    [iconSizeClassName]: true,
    [className]: className,
  });
  return <i className={ViewClassName} />;
};

Symbol.propTypes = {
  sportId: PropTypes.number,
  variant: PropTypes.number,
};

export default Symbol;
