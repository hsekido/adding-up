'use strict';
 // fs(File System)　モジュールを読み込んで使えるようにする
 const fs = require('fs');
// readline モジュールを読み込んで使えるようにする
const readline = require('readline');
// popu-pref.csv をファイルとして読み込める状態に準備する
const rs = fs.createReadStream('./popu-pref.csv');
// readline モジュールに fs を設定する
const rl = readline.createInterface({ input: rs, output: {} });
// popu-pref.csv のデータを1行ずつ読み込んで、設定された関数を実行する
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {const columns = lineString.split(',');
// [']
const year = parseInt(columns[0]);
const prefecture = columns[1];
const popu = parseInt(columns[3]);
if (year === 2010 || year === 2015) {
    // 都道府県毎のデータを作る。データがなかったらデータを初期化
    let value = prefectureDataMap.get(prefecture);
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
      }
      // 並べ替えを行う　（難しすぎるので覚えなくてOK）
      const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      // 引き算の結果、マイナスなら降順、プラスなら昇順に入れ替え
        return pair2[1].change - pair1[1].change;
});
const rankingStrings = rankingArray.map(([key, value]) => {
    return (key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change);
  });
  console.log(rankingStrings);
});