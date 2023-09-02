import { PUMP_TYPE } from './constants/pump-type.const';

export type PumpType = (typeof PUMP_TYPE)[keyof typeof PUMP_TYPE];
