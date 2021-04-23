import createModels from '../src/models';
import dotenv from 'dotenv';
import ModelFactoryInterface from '../src/models/typings/ModelFactoryInterface';
import chalk from 'chalk'
import { PointAttributes } from '../src/models/Point';

dotenv.config();
const models: ModelFactoryInterface = createModels()
const points: PointAttributes[] = [
  {
    name: 'Pelabuhan Kontainer',
    latitude: 1.4417566165181432,
    longitude: 125.1986275905147,
    description: '',
    type_id: 9
  },
  {
    name: 'Pelabuhan Penyebrangan',
    latitude: 1.4434365491443153,
    longitude: 125.20101561993398,
    description: '',
    type_id: 9
  },
  {
    name: 'RedDoorz Hotel',
    latitude: 1.4484133631440885,
    longitude: 125.19352469594781,
    description: '',
    type_id: 5
  },
  {
    name: 'Pelabuhan Samudera Bitug',
    latitude: 1.438331457376463,
    longitude: 125.19333157690299,
    description: '',
    type_id: 5
  },
  {
    name: 'Pasar Tua Bitug',
    latitude: 1.4428575950688156,
    longitude: 125.18796715899168,
    description: '',
    type_id: 7
  },
  {
    name: 'Kungkungan Bay Resort',
    latitude: 1.4664265332327149,
    longitude: 125.22942805882165,
    description: '',
    type_id: 2
  },
  {
    name: 'RSUD Bitung',
    latitude: 1.4404252273591023,
    longitude: 125.1180047817619,
    description: '',
    type_id: 11
  },
  {
    name: 'SPBU Watudambo',
    latitude: 1.4099787558079473,
    longitude: 125.07512723255162,
    description: '',
    type_id: 12
  },
  {
    name: 'SPBU Manembo Nembo',
    latitude: 1.428664104739963,
    longitude: 125.11792040801676,
    description: '',
    type_id: 12
  },
];

(() => {
  points.forEach(async (point, index) => {
    // let i = 0;
    try {
      await models.Point.create({ ...point })
      console.log(`point ${point.name}`)
      if (index < points.length) process.exit(0);
    } catch (error) {
      console.log(error)
    }
  })
})()