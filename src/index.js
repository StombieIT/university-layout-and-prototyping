import {store} from "@/store";
import {ApplicationStage} from "@/constants";
import '@/layers/menu';
import './index.scss';
import './authorization';

store.applicationStage = ApplicationStage.AUTHORIZATION;
