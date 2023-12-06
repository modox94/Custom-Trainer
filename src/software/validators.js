const Ajv = require("ajv");
const { LANGS_CODES, MOTOR_FIELDS } = require("../constants/constants");

const ajv = new Ajv();

const programSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    maxResistanceLevel: { type: "number" },
    steps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          resistanceLevel: { type: "number" },
          targetRpm: { type: "number" },
        },
        required: ["resistanceLevel", "targetRpm"],
        additionalProperties: true,
      },
    },
  },
  required: ["title", "maxResistanceLevel", "steps"],
  additionalProperties: true,
};

const interfaceSchema = {
  type: "object",
  properties: {
    lang: { enum: Object.values(LANGS_CODES) },
    cursorNone: { type: "boolean" },
    showTips: { type: "boolean" },
    devStatus: { type: "boolean" },
  },
  required: ["lang"],
  additionalProperties: true,
};

const peripheralSchema = {
  type: "object",
  properties: {
    [MOTOR_FIELDS.MIN_POS]: {
      type: "number",
      maximum: 100,
      minimum: 0,
      nullable: true,
    },
    [MOTOR_FIELDS.MAX_POS]: {
      type: "number",
      maximum: 100,
      minimum: 0,
      nullable: true,
    },
    [MOTOR_FIELDS.SLEEP_RATIO]: { type: "number", nullable: true },
    [MOTOR_FIELDS.SWAP_MOTOR_WIRES]: { type: "boolean", nullable: true },
    [MOTOR_FIELDS.SWAP_POTEN_WIRES]: { type: "boolean", nullable: true },
  },
  required: Object.values(MOTOR_FIELDS),
  additionalProperties: true,
};

exports.validateProgram = ajv.compile(programSchema);
exports.validateInterface = ajv.compile(interfaceSchema);
exports.validatePeripheral = ajv.compile(peripheralSchema);
