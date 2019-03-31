import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';

const dataset = [
  { "date": "1-May-12", "val": 58.13 },
  { "date": "30-Apr-12", "val": 53.98 },
  { "date": "27-Apr-12", "val": 67 },
  { "date": "26-Apr-12", "val": 89.7 },
  { "date": "25-Apr-12", "val": 99 },
  { "date": "24-Apr-12", "val": 130.28 },
  { "date": "23-Apr-12", "val": 166.7 },
  { "date": "20-Apr-12", "val": 234.98 },
  { "date": "19-Apr-12", "val": 345.44 },
  { "date": "18-Apr-12", "val": 443.34 },
  { "date": "17-Apr-12", "val": 543.7 },
  { "date": "16-Apr-12", "val": 580.13 },
  { "date": "13-Apr-12", "val": 605.23 },
  { "date": "12-Apr-12", "val": 622.77 },
];

const defaultSize = { x: 600, y: 400 };
// グラフ本体の位置
const graphBody = {
  top: 20,
  left: 80,
  right: 60,
  bottom: 60
};
const graphBodyWidth = defaultSize.x - graphBody.left - graphBody.right;
// グラフ本体の高さ
const graphBodyHeight = defaultSize.y - graphBody.top - graphBody.bottom;
// 軸
const axis = {
  strokeWidth: 4
};
// メモリ
const ticks = {
  xSize: dataset.length,
  ySize: 10
};
/**
* x軸方向のlabelの座標一覧
*/
const xLabelPosList = [];
for (let i = 0, iz = ticks.xSize; i < iz; i++) {
  xLabelPosList.push((graphBodyWidth / iz) * i);
}
/**
 * y軸方向のlabelの座標一覧
 */
const yLabelPosList = [];
for (let i = 0, iz = ticks.ySize; i <= iz; i++) {
  yLabelPosList.push((graphBodyHeight / iz) * i);
}
/**
 * y軸方向のlabel一覧
 */
const yLabelListWk = [];
let vals = dataset.map(v => v.val)
  , maxVal = Math.max(...vals)
  , tickValMax = Math.ceil(maxVal / 100) * 100
  ;
for (let i = 0, iz = ticks.ySize; i <= iz; i++) {
  yLabelListWk.push((tickValMax / iz) * i)
}
const yLabelList = yLabelListWk.reverse();

const xTicksPosList = [];
for (let i = 0, iz = ticks.ySize; i < iz; i++) {
  xTicksPosList.push((graphBodyHeight / iz) * i)
}
/**
 * y軸方向のメモリの座標一覧
 */
const yTicksPosList = [];
for (let i = 0, iz = ticks.xSize; i < iz; i++) {
  yTicksPosList.push((graphBodyWidth / iz) * (i + 1)) // 開始がy軸と重なるので一個ずらす
}

class App extends Component {

  componentDidMount() {
    this.created();
  }

  created = () => {
    // グラフ本体の幅/高さをrangeとして座標算出関数を作成
    let xScale = d3.scaleBand()
      .range([0, graphBodyWidth])
      .domain(dataset.map(v => v.date));

    let yScale = d3.scaleLinear()
      .rangeRound([graphBodyHeight, 0])
      .domain([0, Math.max(...yLabelList)]);

    // d3のpath generatorでdを計算する関数を作る(補完は適当に曲線にした)
    let line = d3.line()
      .x((d, i) => xScale(d.date))
      .y((d, i) => yScale(d.val))
      .curve(d3.curveMonotoneX);

    d3.select('.line1').attr('d', line(dataset))
  }

  render() {
    return (
      <div className="mod-graph" id="graph">
        <svg width="600" height="400" viewBox={`0 0 ${defaultSize.x} ${defaultSize.y}`}>
          <g className="graphBody" transform={`translate(${graphBody.left}, ${graphBody.top})`}>
            {/* x軸方向のメモリ */}
            <g className="ticksX">
              {
                xTicksPosList.map((pos, idx) =>
                  <g className="tick" transform={`translate(0, ${pos})`} key={pos}>
                    <line x1="0" y1="0" x2={graphBodyWidth} y2="0"></line>
                  </g>
                )
              }
            </g>

            {/* y軸方向のメモリ */}
            <g className="ticksY">
              {
                yTicksPosList.map((pos, idx) =>
                  <g className="tick" transform={`translate(${pos}, 0)`} key={pos}>
                    <line x1="0" y1="0" x2="0" y2={graphBodyHeight}></line>
                  </g>
                )
              }
            </g>

            {/* グラフ線分 */}
            <g className="paths">
              <path className="line1" stroke="blue" strokeWidth="2" fill="none"></path>
            </g>

            {/* x軸 */}
            <g className="axisX">
              <line x1={-axis.strokeWidth / 2} y1={graphBodyHeight} x2={graphBodyWidth} y2={graphBodyHeight} strokeWidth={axis.strokeWidth}></line>
            </g>

            {/* y軸 */}
            <g className="axisY">
              <line x1="0" y1="0" x2="0" y2={graphBodyHeight} strokeWidth={axis.strokeWidth}></line>
            </g>
          </g>

          {/* x軸のラベル */}
          <g className="labelX" transform={`translate(${graphBody.left}, ${graphBody.top + graphBodyHeight})`}>
            {
              xLabelPosList.map((pos, idx) =>
                <g className="tick" transform={`translate(${pos}, 0)`} key={dataset[idx].date}>
                  <text x="5" y={10 + axis.strokeWidth} transform="rotate(45)">{dataset[idx].date}</text>
                </g>
              )
            }
          </g>

          {/* y軸のラベル */}
          <g className="labelY" transform={`translate(0, ${graphBody.top})`}>
            {
              yLabelPosList.map((pos, idx) =>
                <g className="tick" transform={`translate(0, ${pos})`} key={yLabelList[idx]}>
                  <text x={graphBody.left - 5} y="0" textAnchor="end">{yLabelList[idx]}</text>
                </g>
              )
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default App;