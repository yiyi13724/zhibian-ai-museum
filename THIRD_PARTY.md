# 第三方组件与资料归属

项目：智变 · 未来生产力展馆 2.0。核对日期：2026 年 10 月 7 日。

所有运行组件与地图均本地加载。下列库的授权不等于本站原创代码或引用研究资料的授权；重新分发时请保留对应许可证、版权声明和 NOTICE。

## Apache ECharts 6.1.0

用途：交互图表、热力图、世界地图、产业关系图、图表图片导出与教学实验图表。本地文件为 `vendor/echarts.min.js`，发行文件的 Apache 许可头已保留；没有作为独立脚本额外引入 D3。

主许可证为 Apache License 2.0。发行包说明部分代码包含 D3 的 BSD 3-Clause 许可内容，因此相应许可也随源码保留。

| 本地文件 | 内容 | 官方上游 |
| --- | --- | --- |
| `vendor/ECHARTS-LICENSE.txt` | Apache License 2.0 正文及子组件说明 | [ECharts 6.1.0 LICENSE](https://raw.githubusercontent.com/apache/echarts/6.1.0/LICENSE) |
| `vendor/ECHARTS-NOTICE.txt` | Apache ECharts 与 Apache Software Foundation 归属声明 | [ECharts 6.1.0 NOTICE](https://raw.githubusercontent.com/apache/echarts/6.1.0/NOTICE) |
| `vendor/ECHARTS-D3-LICENSE.txt` | D3 相关部分的 BSD 3-Clause 版权、条件与免责条款 | [ECharts 6.1.0 LICENSE-d3](https://raw.githubusercontent.com/apache/echarts/6.1.0/licenses/LICENSE-d3) |

项目来源：[Apache ECharts 官方 GitHub 仓库](https://github.com/apache/echarts)。其 LICENSE 明确列出部分树图、矩形树图、图关系布局及数值工具包含 D3 授权代码。本站对图表配置、数据组织和交互逻辑作原创实现，未修改库的许可正文。

## Three.js 0.186.1 与 OrbitControls

用途：程序化三维产业建筑、中央数据塔、光流、视角旋转和射线点选。`vendor/three.bundle.js` 将 Three.js 与同项目的 `examples/jsm/controls/OrbitControls.js` 打包为可离线使用的经典浏览器脚本，公开 `window.THREE` 与 `THREE.OrbitControls`。

项目主许可证为 MIT，本地保留 `vendor/THREE-LICENSE.txt`。打包产生的库版权与 SPDX 标识保留在 `vendor/three.bundle.js.LEGAL.txt`，应与脚本一并分发。

可选开发入口 `vendor/three.entry.js` 保留原始模块导入，网页直接加载已生成的 `three.bundle.js`。根目录 `package.json` 固定 Three.js 0.186.1 与打包工具 esbuild 0.28.2；开发者可执行 `npm install` 和 `npm run build:vendor` 重新打包。esbuild 仅为构建工具，没有作为网页运行库分发。[esbuild 官方仓库及 MIT 许可证](https://github.com/evanw/esbuild)

- [Three.js 官方 GitHub 仓库](https://github.com/mrdoob/three.js)
- [Three.js r186 MIT LICENSE](https://raw.githubusercontent.com/mrdoob/three.js/r186/LICENSE)
- [OrbitControls 上游源码](https://raw.githubusercontent.com/mrdoob/three.js/r186/examples/jsm/controls/OrbitControls.js)

三维建筑、岛屿、标签、粒子路径及五产业概念造型由本站程序化生成，不使用外部三维模型、贴图、照片或远程字体。中文标签纹理来自本地 Canvas 绘制。

## Natural Earth 110m 国家轮廓

用途：展示 AI 私人投资市场的地理位置。Natural Earth 声明其地图数据属于公有领域，可以修改和再分发；本站仍保留来源，方便核验。[Natural Earth 官方使用条款](https://www.naturalearthdata.com/about/terms-of-use/)

本地 `vendor/world.js` 基于 Natural Earth 1:110,000,000 比例尺的 `ne_110m_admin_0_countries.geojson`：

- [Natural Earth 官方项目 GitHub 数据文件](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_admin_0_countries.geojson)
- [该文件的原始 GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson)

本站仅保留几何形状与 `ADMIN` 名称，将名称放入 `properties.name`，把坐标四舍五入到小数点后 3 位，并写成 `window.WORLD_MAP` 的本地 JavaScript 数据。三位小数是文件精简规则，不代表地理测量精度；1:110m 地图属于全球展示尺度，小市场可能无法辨认，应以完整数据榜单补充。地理轮廓不用于精确测绘或国界认定。

投资数值来自 Stanford AI Index 2026，而非 Natural Earth。图中只收录报告列出的 15 个市场；未收录市场不等于投资为零。着色用于标出市场，不表示金额比例，具体数值见图表提示、榜单与 CSV。[AI Index 2026 经济章节，图 4.2.8](https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_4_economy.pdf)

## 研究、政策与产业案例

Stanford HAI、McKinsey、IEA、IFR、QJE、Science、Management Science、METR、EMBL-EBI、FDA、FAO、UNESCO 与中国官方政策来源的资料权利归原发布者所有。本站以简要释义、事实数据和直接来源链接支持教学展示，不复制整份报告或论文。

页面“开放证据”及 `数据与方法.md` 提供逐项来源和适用边界。论文结果、机构情景预测、本站原创概念示意、合成教学模拟分别标注，不因使用开源图形库而获得原始研究的重新授权，也不表示相关机构对本作品背书。
