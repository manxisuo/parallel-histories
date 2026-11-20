# 时空对望 · 历史知识库编辑规范（V5.10）

## 数据布局

- `data/history.json`：事件 `events[]` 与历史时期 `periods[]`，目前 `schemaVersion: 4`。
- `data/regions.json`：地区轨道及其展示颜色、默认可见性。轨道只是地理编辑分类，**不是**政治疆界、民族身份或文明优劣分类。
- `data/places.json`：历史地点的大致现代坐标。不能据此推断古代国界和历史建筑位置。
- `scripts/validate-data.mjs`：CI 使用的结构校验器；在本地执行 `node scripts/validate-data.mjs`。

## 事件规范

```json
{
  "id": "mansa-musa-pilgrimage",
  "year": 1324,
  "title": "曼萨·穆萨赴麦加朝觐",
  "civilization": "world",
  "trackId": "africa",
  "region": "非洲 · 西非及北非",
  "category": "宗教与思想",
  "precision": "year",
  "summary": "1324—1325年，马里统治者曼萨·穆萨前往麦加朝觐。",
  "placeIds": [],
  "sourceUrl": "https://www.metmuseum.org/ru/toah/ht/07/afu",
  "sources": [{"url":"https://www.metmuseum.org/ru/toah/ht/07/afu","kind":"institutional-chronology"}]
}
```

`year` 使用**天文纪年**：公元前1年 = 0，公元前321年 = -320；绝不能直接把负数显示给访客。时期 `startYear` 和 `endYear` 同样遵循该约定。

事件的 `year` 表示时间定位，不保证都是发生在单年的孤立事件。用 `precision: "approximate"` 标记近似时间点，`summary` 中必须说明是否为**长期现象的观察年份**。对于跨多世纪现象，优先另建 `periods[]`，避免伪造创立年份。

## 历史时期规范

每个 `periods[]` 项至少包含 `id`、`name`、`startYear`、`endYear`、`civilization`、`trackId`、`precision`、`sourceUrl`、`sources[]`，可额外提供 `note` 记录史学争议与边界限制。历史时期的两端不应默认被理解为硬边界。

## 可追溯性

- `sourceUrl` 必须是 HTTPS 地址，并出现在 `sources[]` 中。
- `sources[]` 的 `kind` 字段用于区分 `institutional-chronology`（博物馆、机构历史年表）和 `editorial-reference`（先前项目的编辑参考，仍需逐条复核）。
- 当前 V5.10 新增的地区记录主要参考大都会艺术博物馆的 Heilbrunn Timeline of Art History、相关专题论文和美国国家地理学会的公开介绍。单个年表可能只支持事件的部分细节；如发生争议应补充专门史料，不得把引用存在等同于事实已被完整证明。
- 不应把同时发生当作有因果关系；跨文明技术传播、外交往来等关系应单独建立经过查证的证据链。
- 应尽量采用博物馆、学术出版物、研究机构或高质量百科作为公开来源。不得复制其文章长段文字。

## 新数据提交流程

1. 确定拟增加事件或时期的准确内涵、地理轨道与近似日期。
2. 阅读原始来源并核查是否真正支持事件名称、时间和描述。
3. 为每项填写 `sourceUrl`、`sources[]`、`precision` 和解释性 `summary` / `note`。
4. 运行 `node scripts/validate-data.mjs`，检查引用、ID 唯一性、地区轨道和年份合法性。
5. 在首页逐个测试事件节点、时期色带的点击和来源链接；至少选用公元前、古典时代、中世纪、近现代的代表年份。
6. 仅在有充分证据时才添加跨地区因果关系，否则维持独立条目。

## 已知限制

- 现有史料库属于**经过精选的编辑型原型**，并非全球各地区完整年表。
- 老数据中的许多 `editorial-reference` 来源尚待逐项复核。
- `trackId` 目前允许每条事件对应一个主要地理观察视角；复杂跨区域事件未来应支持多轨关联，但不能简单复制成多个无来源的独立事件。
- 当前页面仍以单点标记方式呈现约略事件；详细的时间区间交互和时间不确定性可视化将继续完善。
