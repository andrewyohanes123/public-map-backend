import createModels from '../src/models';
import chalk from 'chalk';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ModelFactoryInterface from '../src/models/typings/ModelFactoryInterface';

dotenv.config();

const districts = [{
  name: "KAB. BOLAANG MONGONDOW"
},
{
  name: "KAB. MINAHASA"
},
{
  name: "KAB. KEPULAUAN SANGIHE"
},
{
  name: "KAB. KEPULAUAN TALAUD"
},
{
  name: "KAB. MINAHASA SELATAN"
},
{
  name: "KAB. MINAHASA UTARA"
},
{
  name: "KAB. MINAHASA TENGGARA"
},
{
  name: "KAB. BOLAANG MONGONDOW UTARA"
},
{
  name: "KAB. KEP. SIAU TAGULANDANG BIARO"
},
{
  name: "KAB. BOLAANG MONGONDOW TIMUR"
},
{
  name: "KAB. BOLAANG MONGONDOW SELATAN"
},
{
  name: "KOTA MANADO"
},
{
  name: "KOTA BITUNG"
},
{
  name: "KOTA TOMOHON"
},
{
  name: "KOTA KOTAMOBAGU"
}];

(async (): Promise<void> => {
  const models: ModelFactoryInterface = createModels();
  districts.forEach(async ({ name }, idx) => {
    const createdDistrict = await models.District.create({ name });
    console.log(`${chalk.bgBlack(chalk.white('[Kabupaten/Kota]'))} : ${createdDistrict.name}`);

    if (districts.length === (idx + 1)) {

      process.exit(0);
    }
  })
})()