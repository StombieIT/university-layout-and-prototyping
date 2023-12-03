import {store} from "@/store";
import {ApplicationStage} from "@/constants";
import '@/layers/menu';
import '@/layers/first-level';
import '@/layers/third-level';
import '@/layers/second-level';
import './index.scss';
import './authorization';
import './storage-handler';

store.applicationStage = ApplicationStage.AUTHORIZATION;
