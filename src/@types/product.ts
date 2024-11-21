import { Advantage } from './advantage';
import { Category } from './category';
import { ServicePack } from './service-pack';
import {QaA} from "@/@types/QaA";
import {BonusService} from "@/@types/bonus-service";

export enum AttributeKey {
  VCPU = 'vCPU',
  RAM = 'RAM',
  SSD = 'SSD',
  BANDWIDTH = 'BANDWIDTH',
  TRANSMISSION_TRAFFIC = 'TRANSMISSION_TRAFFIC',
  IP = 'IP',
}

export type Product = {
  _id: string;
  key: string;
  banner: string;
  category: Category;
  intro: string;
  title: string;
  description: string;
  advantages: Advantage[];
  questionsAndAnswers: QaA[];
  tags: string[];
  isContact: boolean;
  servicePacks: ServicePack[];
  bonusServices: BonusService[];
};
