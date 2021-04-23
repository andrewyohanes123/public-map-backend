import createModels from '../src/models';
import dotenv from 'dotenv';
import ModelFactoryInterface from '../src/models/typings/ModelFactoryInterface';
import { TypeAttributes } from '../src/models/Type';
import chalk from 'chalk'

dotenv.config();
const models: ModelFactoryInterface = createModels();
((): void => {
  const types: TypeAttributes[] = [
    {
      name: 'Apotek',
      color: '#00b894',
      icon: 'apotik.svg'
    },
    {
      name: 'Daya Tarik Pariwisata',
      color: '#0984e3',
      icon: 'data tarik pariwisata.svg'
    },
    {
      name: 'Gardu Listrik',
      color: '#00cec9',
      icon: 'Gardu Listrik.svg'
    },
    {
      name: 'Hotel',
      color: '#2d3436',
      icon: 'hotel.svg'
    },
    {
      name: 'Lampu Jalan',
      color: '#fdcb6e',
      icon: 'lampu jalan.svg'
    },
    {
      name: 'Lampu Lalu Lintas',
      color: '#d63031',
      icon: 'lampu lalu lintas.svg'
    },
    {
      name: 'Pasar',
      color: '#6c5ce7',
      icon: 'Pasar.svg'
    },
    {
      name: 'Pelabuhan Tambatan Kapal',
      color: '#e67e22',
      icon: 'Pelabuhan Tambatan Kapal.svg'
    },
    {
      name: 'Pelabuhan Laut',
      color: '#16a085',
      icon: 'Pelabuhan Laut.svg'
    },
    {
      name: 'Perpustakaan',
      color: '#34495e',
      icon: 'perpustakaan.svg'
    },
    {
      name: 'Rumah Sakit',
      color: '#c0392b',
      icon: 'Rumah Sakit.svg'
    },
    {
      name: 'SPBU',
      color: '#e74c3c',
      icon: 'SPBU.svg'
    },
  ]
  types.forEach(type => {
    models.Type.create({ ...type }).then(createdType => {
      console.log(`${chalk.green(`[Berhasil]`)}: ${createdType.name}; warna : ${createdType.color}; icon: ${createdType.icon}`);
    }).catch(e => {
      console.log(`${chalk.bgRed(`[Errno] : `)} ${e.toString()}`);
    })
  })
})()