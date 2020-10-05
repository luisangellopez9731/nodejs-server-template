import { route } from '../lib/interfaces';
import { get } from './test'
export const baseDir = "";

export const routes: route[] = [
    { path: "test", use: { get } }
];
