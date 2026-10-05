import { BranchType } from "@/entities/branch/branch.entry";
import { UserRole } from "@/entities/user/user.entry";

import type { BranchRecord, UserRecord } from "../mock-db.types";

export const HEAD_OFFICE_ID = "br-ho";

export const SEED_BRANCHES: BranchRecord[] = [
  { id: HEAD_OFFICE_ID, name: "Bosh ofis", type: BranchType.HEAD_OFFICE },
  { id: "br-tsh", name: "Toshkent shahar filiali", type: BranchType.REGIONAL },
  { id: "br-tvl", name: "Toshkent viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-smq", name: "Samarqand viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-bux", name: "Buxoro viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-frg", name: "Farg'ona viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-and", name: "Andijon viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-nam", name: "Namangan viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-qsh", name: "Qashqadaryo viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-srx", name: "Surxondaryo viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-xrz", name: "Xorazm viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-nav", name: "Navoiy viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-jiz", name: "Jizzax viloyat filiali", type: BranchType.REGIONAL },
  { id: "br-qqr", name: "Qoraqalpog'iston filiali", type: BranchType.REGIONAL },
];

const user = (id: string, username: string, fullName: string, position: string, role: UserRole, branchId: string): UserRecord => ({
  id,
  username,
  fullName,
  position,
  role,
  branchId,
});

export const DIRECTOR_ID = "u-head-1";
export const DEPUTY_ID = "u-head-2";

export const SEED_USERS: UserRecord[] = [
  user(DIRECTOR_ID, "rustam.x", "Rustam Xolmatov", "Yuridik departament direktori", UserRole.HEAD, HEAD_OFFICE_ID),
  user(DEPUTY_ID, "feruza.s", "Feruza Saidova", "Shartnomaviy-huquqiy ishlar bo'limi boshlig'i", UserRole.HEAD, HEAD_OFFICE_ID),
  user("u-law-1", "dilnoza.k", "Dilnoza Karimova", "Bosh yuristkonsult", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-law-2", "jasur.t", "Jasur Toshmatov", "Yetakchi yuristkonsult", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-law-3", "malika.y", "Malika Yusupova", "Yuristkonsult (sud ishlari)", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-law-4", "bekzod.r", "Bekzod Rahimov", "Yuristkonsult (korporativ)", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-law-5", "nodira.a", "Nodira Abdullayeva", "Yetakchi yuristkonsult", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-law-6", "sardor.q", "Sardor Qodirov", "Yuristkonsult (ijro ishlari)", UserRole.LAWYER, HEAD_OFFICE_ID),
  user("u-ho-1", "aziz.m", "Aziz Mirzayev", "Kredit departamenti bosh mutaxassisi", UserRole.HEAD_OFFICE, HEAD_OFFICE_ID),
  user("u-ho-2", "kamola.e", "Kamola Ergasheva", "Xaridlar bo'limi boshlig'i", UserRole.HEAD_OFFICE, HEAD_OFFICE_ID),
  user("u-ho-3", "shoxrux.a", "Shoxrux Aliyev", "Xodimlar bilan ishlash departamenti", UserRole.HEAD_OFFICE, HEAD_OFFICE_ID),
  user("u-br-1", "anvar.s", "Anvar Sobirov", "Filial boshqaruvchisi o'rinbosari", UserRole.BRANCH, "br-smq"),
  user("u-br-2", "lola.h", "Lola Hamidova", "Kredit bo'limi boshlig'i", UserRole.BRANCH, "br-frg"),
  user("u-br-3", "ulugbek.t", "Ulug'bek Turg'unov", "Filial yuristkonsulti", UserRole.BRANCH, "br-bux"),
  user("u-br-4", "madina.r", "Madina Rasulova", "Chakana biznes bo'limi boshlig'i", UserRole.BRANCH, "br-and"),
  user("u-br-5", "javohir.o", "Javohir Ortiqov", "Filial yuristkonsulti", UserRole.BRANCH, "br-nam"),
  user("u-br-6", "sevara.p", "Sevara Po'latova", "Muammoli kreditlar bo'limi", UserRole.BRANCH, "br-qsh"),
  user("u-br-7", "behruz.x", "Behruz Xudoyberdiyev", "Filial boshqaruvchisi", UserRole.BRANCH, "br-xrz"),
  user("u-br-8", "nigora.m", "Nigora Mahmudova", "Filial yuristkonsulti", UserRole.BRANCH, "br-tvl"),
  user("u-br-9", "sanjar.b", "Sanjar Boboyev", "Kredit bo'limi boshlig'i", UserRole.BRANCH, "br-tsh"),
];

export const DEMO_USERNAMES = ["rustam.x", "feruza.s", "dilnoza.k", "nodira.a", "aziz.m", "anvar.s"];

export const DEMO_PASSWORD = "demo";

export const COUNTERPARTIES = [
  "“Texno Servis Plyus” MChJ",
  "“Grand Qurilish Invest” MChJ",
  "“Silk Road Logistics” MChJ",
  "“Agro Export Trade” AJ",
  "“Smart Solutions” MChJ",
  "“Orient Security” MChJ",
  "“Digital Pay” MChJ",
  "“Mega Build” XK",
  "“Navro'z Agro” fermer xo'jaligi",
  "“Samarqand Tekstil” AJ",
  "“Zarafshon Oltin Meva” MChJ",
  "“Farg'ona Paxta Klaster” MChJ",
];

export const CITIZENS = ["Karimov A.", "Nurmatova S.", "Yo'ldoshev B.", "Qurbonova M.", "Ergashev D.", "Tojiboyeva G.", "Hasanov I.", "Olimova Z."];

export const COURTS = [
  "Toshkent shahar iqtisodiy sudi",
  "Toshkent viloyat iqtisodiy sudi",
  "Samarqand viloyat iqtisodiy sudi",
  "Farg'ona tumanlararo iqtisodiy sudi",
  "Buxoro viloyat iqtisodiy sudi",
  "Yunusobod tumanlararo fuqarolik ishlari sudi",
  "Andijon shahar fuqarolik ishlari sudi",
  "Toshkent shahar sudi (apellyatsiya instansiyasi)",
];

export const IPS = ["10.12.4.21", "10.12.4.37", "10.14.1.8", "10.20.7.112", "10.31.2.45", "10.12.9.14"];
