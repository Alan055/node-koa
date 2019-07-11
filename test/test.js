let a = [
  [
    {type: '01', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '02', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '03', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '04', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '05', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '06', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '07', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '08', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '09', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '10', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
  ],
  [
    {type: '11', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '12', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '13', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '14', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '15', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '16', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '17', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '18', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '19', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '20', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false}
  ],
  [
    {type: '21', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '22', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '23', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '24', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '25', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '26', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '27', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '28', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '29', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '30', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false}
  ],
  [
    {type: '31', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '32', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '33', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '34', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '35', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '36', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '37', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '38', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '39', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '40', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
  ],
  [
    {type: '41', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '42', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '43', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '44', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false},
    {type: '45', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '46', rate: '', input: '', num: '', code: 'j25073', color: 'red', active: false},
    {type: '47', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '48', rate: '', input: '', num: '', code: 'j25073', color: 'blue', active: false},
    {type: '49', rate: '', input: '', num: '', code: 'j25073', color: 'green', active: false}
  ],
]

let b = {
  weishu_1: {
    'w0': [10, 20, 30, 40],
    'w1': [1, 11, 21, 31, 41],
    'w2': [2, 12, 22, 32, 42],
    'w3': [3, 13, 23, 33, 43],
    'w4': [4, 14, 24, 34, 44]
  },
  weishu_2: {
    'w5': [5, 15, 25, 35, 45],
    'w6': [6, 16, 26, 36, 46],
    'w7': [7, 17, 27, 37, 47],
    'w8': [8, 18, 28, 38, 48],
    'w9': [9, 19, 29, 39, 49]
  },
}
let re = []
for (let key in b) {
  for (let i in b[key]) {
    let middle = {
      [i]: b[key][i].join(',')
    }
    re.push(middle)
  }
}
console.log(JSON.stringify(re))


var c = []
for (let i = 1; i < 50; i++) {
  if (i % 2 === 0) {
    c.push(i)
  }
}
console.log(JSON.stringify(c))


let d = {
  type: 'one',
  active: false,
  word: '合双',
  ids: ['蓝合双', '红合双', '绿合双']
}
