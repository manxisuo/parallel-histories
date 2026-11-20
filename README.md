# 时空对望 · Parallel Histories

在同一条时间坐标上，探索中国与世界历史。

## V1 功能
- Canvas 双轨时间轴，支持拖动、缩放、触屏手势
- 中国历史与世界历史时期对照
- 事件节点、详情展厅、关键词搜索、随机穿越
- 移动端适配和键盘操作

## 本地运行
纯静态网页，直接打开 `index.html` 即可。也可用 `python -m http.server 8000` 启动本地服务器。

## GitHub Pages
在仓库 Settings → Pages → Build and deployment → Source 中选择 **GitHub Actions**。每次推送 `main` 分支会触发 `.github/workflows/pages.yml`。

预计站点地址：https://manxisuo.github.io/parallel-histories/

## 历史内容说明
V1 为历史可视化原型，仅收录少量精选事件。年代与历史分期可能存在争议；部分事件采用约略年份定位。点击事件可查看参考来源。后续将加入更严格的史料来源结构、历史地图和专题展厅。

## V3：历史数据与地图

- [历史地图](https://manxisuo.github.io/parallel-histories/atlas.html)：基于 WGS84 经纬度的墨卡托投影、经纬网、城市标记、拖动缩放、年份切片与地点说明。
- `data/history.json`：事件、时期、时间精度、来源与地点关联。
- `data/places.json`：现代城市近似坐标与历史地点说明。
- `node scripts/validate-data.mjs`：验证数据格式、事件 ID、地点引用和坐标范围。

### 纪年约定

数据使用天文纪年：公元前 1 年 = 0，公元前 221 年 = -220。展示时转换为历史纪年，不显示公元零年。

### 已知限制

V3.2 地图是基于真实经纬度的**城市位置图**，当前背景仅绘制经纬网，**没有地形、海岸线、历史国界或经过考证的历史路线**。地点坐标多为现代城市中心的近似位置。地图按所选年份前后 35 年的事件筛选地点，不能据此推断某个城市在该年代的存续或政治归属。后续需接入经过授权的地理底图和经过史料核对的历史地理图层。
