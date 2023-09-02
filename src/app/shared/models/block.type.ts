import { DevicesDto } from '../../live-controller/dtos/devices.dto';

export type BlockType = {
  duration: number;
  devices: DevicesDto;
};
