// 可选的 Three.js 打包入口；网页直接使用本地 three.bundle.js。
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
window.THREE = { ...THREE, OrbitControls };
