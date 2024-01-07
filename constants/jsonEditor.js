var fs = require('fs');

// // const theme2024 =["SYSTEMS IMPROVEMENT", "SYSTEMS IMPROVEMENT", "MACRO-EVANGELISM","MACRO-EVANGELISM", 'ACCOUNT SETTLEMENT', 'ACCOUNT SETTLEMENT', "RELATIONAL DISCIPLESHIP", "RELATIONAL DISCIPLESHIP", "TRAINING-CENTERED", "TRAINING-CENTERED", "CHURCH", "CHURCH"];

let month_0 = `Joshua 1:1-9,1 Timothy 3:1-7,Hebrews 13:1-19,1 Peter 5:1-11,Jeremiah 29:1-14,Acts 6:1-7,Sermon Notes,Matthew 28:16-20,Psalm 95:1-11,Psalm 100:1-5,John 4:19-26,Colossians 3:12-17,Hebrews 10:19-25,Sermon Notes,Proverbs 4:20-27,1 Corinthians 11:17-34,2 Corinthians 13:1-10,Philippians 1:1-11,Revelation 2:1-7,1 Corinthians 4:1-7,Sermon Notes,Nehemiah 2:1-20,Proverbs 15:22,1 Corinthians 14:26-40,2 Chronicles 29:1-19,Ecclesiastes 10:10,1 Corinthians 12:12-31,Sermon Notes,Exodus 18:13-27,Acts 16:1-5,1 Corinthians 3:1-23`;

let month_1 = `2 Timothy 4:1-8,Galatians 5:16-26,1 Peter 4:1-11,Sermon Notes,Colossians 3:18-25,Matthew 25:14-30,Romans 12:3-8,Ephesians 2:1-10,Titus 2:1-10,1 Corinthians 15:50-58,Sermon Notes,1 Thessalonians 5:12-28,1 Peter 2:1-12,1 Corinthians 15:1-11,2 Timothy 2:14-26,Matthew 23:1-12,Romans 12:9-21,Sermon Notes,1 Corinthians 9:15-18,Hebrews 6:1-12,1 Corinthians 16:12-18,1 Timothy 1:12-20,2 Corinthians 4:1-6,Colossians 1:1-14,Sermon Notes,Romans 12:1-2,Proverbs 11:14,Proverbs 16:3,Proverbs 20:18`;

let month_2 = `Matthew 28:16-20,Acts 1:6-11,Sermon Notes,Romans 10:5-17,Isaiah 6:1-13,Romans 15:14-21,Acts 13:44-52,1 Corinthians 9:19-27,2 Timothy 4:1-8,Sermon Notes,Acts 20:17-38,Matthew 9:35-38,Acts 16:6-10,Acts 17:22-34,Acts 26:12-32,Acts 14:19-23,Sermon Notes,Romans 1:8-17,Colossians 4:1-6,Psalm 96:1-13,Jeremiah 1:1-19,Ephesians 2:1-10,1 Thessalonians 1:1-10,Sermon Notes,Revelation 7:9-17,Matthew 24:1-14,Matthew 10:5-15,Acts 5:27-42,Acts 4:1-22,Colossians 1:15-23,Sermon Notes`;

let month_3 = `2 Peter 3:1-13,John 4:31-45,Romans 12:9-21,Romans 1:1-7,Acts 18:5-11,Acts 10:34-43,Sermon Notes,Psalm 105:1-6,Romans 12:1-8,Matthew 16:13-20,Acts 9:26-31,Titus 1:5-10,Revelation 2:1-7,Sermon Notes,Romans 16:25-27,Romans 15:22-33,Acts 11:19-30,Romans 14:1-12,Ephesians 3:1-13,Mark 16:14-20,Sermon Notes,1 Peter 3:8-22,Luke 10:1-12,1 Corinthians 9:15-18,Colossians 1:3-14,1 Corinthians 3:1-23,1 Timothy 4:6-16,Sermon Notes,2 Corinthians 10:1-18,1 Thessalonians 2:1-16`;

let month_4 = `Luke 16:1-13,Proverbs 3:5-10,Malachi 3:6-15,Matthew 6:19-24,Sermon Notes,1 Corinthians 4:1-5,Proverbs 22:1-16,Matthew 25:14-30,1 Timothy 6:17-21,2 Corinthians 9:6-15,Luke 12:13-21,Sermon Notes,Proverbs 13:11,Proverbs 11:23-28,2 Corinthians 8:1-15,Haggai 2:1-9,Deuteronomy 8:11-20,Romans 13:8-14,Sermon Notes,Exodus 22:1-15,Psalm 37:21-22,Proverbs 3:21-35,Proverbs 6:1-5,Matthew 18:15-20,Romans 12:14-21,Sermon Notes,Psalm 37:23-33,Proverbs 22:22-29,Ecclesiastes 5:1-7,Luke 7:41-50,Proverbs 17:18`;

let month_5 = `Proverbs 21:20,Sermon Notes,Proverbs 13:22,Proverbs 21:5-6,Proverbs 10:4-5,Proverbs 6:6-11,Genesis 41:1-36,Ecclesiastes 11:1-4,Sermon Notes,Luke 14:25-33,Proverbs 24:3-7,1 Timothy 5:3-8,Proverbs 27:23-27,Haggai 1:1-11,Exodus 25:1-9,Sermon Notes,1 Chronicles 29:1-9,Mark 12:41-44,2 Chronicles 24:1-19,Exodus 36:1-7,2 Chronicles 2:1-18,Ezra 7:1-28,Sermon Notes,Nehemiah 10:28-39,1 Chronicles 29:10-22,Exodus 35:4-29,Nehemiah 5:1-13,Exodus 22:1-15,Deutronomy 15:1-23,Sermon Notes`;

let month_6 = `Matthew 28:16-20,2 Timothy 2:1-13,Proverbs 11:30,Acts 1:6-11,Mark 16:14-20,1 Corinthians 9:19-27,Sermon Notes,Colossians 4:2-6,1 Peter 3:13-17,Romans 10:14-17,Ephesians 6:10-20,2 Corinthians 5:11-21,Acts 8:26-40,Sermon Notes,Matthew 4:18-22,Luke 14:12-24,John 15:1-17,Ecclesiastes 4:9-12,Proverbs 27:17,Galatians 6:1-10,Sermon Notes,Romans 12:9-21,Hebrews 10:19-25,1 Thessalonians 5:1-11,Colossians 3:1-17,James 5:13-20,1 Corinthians 12:12-31,Sermon Notes,Ephesians 4:1-16,Proverbs 27:6,1 Peter 4:1-11`;

let month_7 = `Hebrews 3:7-19,1 Corinthians 16:12-18,John 13:31-35,Sermon Notes,John 8:31-38,Matthew 11:25-30,Luke 9:23-27,Philippians 3:1-11,James 1:19-27,Luke 14:25-33,Sermon Notes,Romans 12:1-2,Psalm 119:9-16,Luke 6:39-42,1 Corinthians 11:1,Colossians 2:6-15,Hebrews 12:1-2,Sermon Notes,2 Timothy 2:14-26,1 Corinthians 3:1-9,Ephesians 6:1-9,2 Timothy 3:10-17,Titus 2:1-15,Proverbs 22:1-16,Sermon Notes,Matthew 18:15-20,Acts 2:42-47,1 Timothy 4:6-16,Romans 15:14-21,1 Peter 5:1-11,Acts 20:17-38`;

let month_8 = `Sermon Notes,2 Timothy 2:1-15,Exodus 18:1-27,1 Peter 2:1-12,Ephesians 4:1-16,1 Timothy 4:6-16,Matthew 28:16-20,Sermon Notes,Colossians 3:12-17,Deuteronomy 31:1-8,1 Corinthians 11:1,Titus 2:1-15,1 Thessalonians 5:12-22,Acts 6:1-7,Sermon Notes,1 Peter 5:1-11,Hebrews 5:11-14,Ephesians 6:1-4,1 Timothy 3:1-7,Titus 1:5-16,1 Timothy 5:17-25,Sermon Notes,1 Timothy 3:8-13,1 Corinthians 4:1-5,Proverbs 9:1-12,Proverbs 1:1-7,Proverbs 4:1-9,2 Timothy 3:10-17,Sermon Notes,Deuteronomy 6:1-9`;

let month_9 = `Proverbs 16:3,Psalm 37:23-26,Proverbs 19:21,Proverbs 3:1-12,Colossians 3:18-25,Sermon Notes,Psalm 119:105-112,Proverbs 20:24,1 Thessalonians 5:23-24,James 4:13-17,Psalm 32:1-11,John 17:1-26,Sermon Notes,Psalm 133:1-3,Romans 15:1-7,1 Corinthians 1:10-17,Colossians 1:3-14,1 Peter 3:8-22,2 Peter 1:3-15,Sermon Notes,Duetronomy 8:1-20,1 Corinthians 9:24-27,Philippians 3:12-21,Hebrews 12:1-17,Ephesians 6:10-20,1 Timothy 6:11-21,Sermon Notes,Romans 12:1-2,1 Corinthians 15:50-58,2 Corinthians 4:7-18,Colossians 2:6-15`;

let month_10 = `Romans 3:21-31,Romans 10:5-13,Sermon Notes,Acts 2:14-41,1 John 1:5-10,Ephesians 2:1-10,Luke 15:1-7,2 Corinthians 5:11-21,Ezekiel 18:14-32,Sermon Notes,Acts 3:11-26,John 3:16-21,1 Peter 1:13-25,1 Timothy 3:1-7,Titus 1:5-16,Exodus 19:1-25,Sermon Notes,Leviticus 20:22-27,1 Peter 5:1-11,Revelation 22:6-21,Matthew 5:43-48,Hebrews 12:1-16,2 Timothy 2:14-26,Sermon Notes,Isaiah 64:1-12,Jeremiah 18:1-23,2 Timothy 3:10-17,Matthew 25:14-29,Colossians 1:1-14,2 Corinthians 9:6-15`;

let month_11 = `Sermon Notes,Proverbs 20:6-7,Psalm 15:1-5,Matthew 5:33-37,Proverbs 11:3,Titus 2:1-15,1 Timothy 3:8-13,Sermon Notes,2 Samuel 23:1-7,Psalm 112:1-10,Colossians 4:2-6,Philippians 4:2-9,1 Thessalonians 5:12-28,Luke 18:1-8,Sermon Notes,James 5:13-20,Matthew 6:5-15,Ephesians 6:10-20,1 Timothy 2:1-15,Psalm 145:1-21,Romans 12:9-21,Sermon Notes,Ecclesiastes 4:9-12,Romans 12:3-8,1 Corinthians 12:12-31,Hebrews 10:19-25,Galatians 6:1-10,1 Peter 4:1-11,Sermon Notes,Proverbs 27:17-19,1 Corinthians 3:9`;

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const verseMonths = [month_0, month_1, month_2, month_3, month_4, month_5, month_6, month_7, month_8, month_9, month_10, month_11]

// let newData2024 = {};
// for(let i=0; i<months.length ;i++){
//    let newArrMonth = [];
//    let newVerseMonth = verseMonths[i].split(",");
//    for(let j=0; j<newVerseMonth.length ;j++){
//       let obj = {
//          date: j+1,
//          verse: newVerseMonth[j],
//          completion: "",
//       }
//       newArrMonth.push(obj);
//       obj = {};
//    }

// // }

// const newData = JSON.stringify(newData2024);
// fs.writeFile("_2024.json", newData, function(err, result) {
//    if(err) console.log('error', err);
// });


// // Read the JSON file
// // let jsonData = JSON.parse(fs.readFileSync("./constants/2023.json"));

// // Add or edit data
// // jsonData["January"][0]["completion"] = "ongoing";

// // Write the JSON file
// // fs.writeFileSync("./constants/2023.json", JSON.stringify(jsonData));

//====================================================================================
//let data = JSON.parse(fs.readFileSync("./constants/2024.json"));

//let monthLength = Object.keys(data).length;
let query = "";
console.log(verseMonths.length);
for(let i = 0; i<verseMonths.length; i++){
   let month = months[i];
   let newVerse = verseMonths[i].split(",");
   for(let j = 0; j<newVerse.length; j++){
      let day = j+1;
      let verse = newVerse[j];

      query += `INSERT INTO brp2024 (month, day, verse, completion) VALUES ("${month}", ${day}, "${verse}", "none");\n`
      }
}

console.log(query);
//====================================================================================

// let bibleVerses = [];
// const data = JSON.parse(fs.readFileSync("./constants/asv.json"));

// data.verses.forEach(function (item) {
//    bibleVerses.push(`${item.book_name} ${item.chapter}:${item.verse}`);
// });

// //console.log(bibleVerses);
// let range = [];
// verseMonths.forEach(function (item, index) {
//       verseMonths[index].split(",");
// })
// let newArray = verseMonths.toString().replaceAll("Sermon Notes,", "");
// let brpVerses = newArray.split(",");
// brpVerses.forEach((item)=>{
//    range.push(`${item.charAt(item.length-2)}${item.charAt(item.length-1)}`);
// })
// let newRange = range.toString().replaceAll("-","").replaceAll(":","")
// let _lastRange = newRange.split(",");
// let initRange = [];
// for(let i=0; i<brpVerses.length;i++){
   
//    if(brpVerses[i].search('-') == -1){
//       initRange.push(brpVerses[i].slice(brpVerses[i].indexOf(':')));
//    }else{
//       initRange.push(brpVerses[i].slice(brpVerses[i].indexOf(':'), brpVerses[i].indexOf('-')));
//    }
// }
// let newInitRange = initRange.toString().replaceAll(':','');
// let _initRange = newInitRange.split(",");


// let __initRange = _initRange.map((item)=>{
//    return parseInt(item);
// })
// let __lastRange = _lastRange.map((item)=>{
//    return parseInt(item);
// })
// // console.log(__initRange)
// // console.log(__lastRange)

// let choppedVerse = [];
// let initialVerse = [];
// let lastVerse = [];

// let errorVerses = [];
// let matchedVerses = [];
// let initErrorVerses = [];
// let lastErrorVerses = [];
// for(let i=0; i<brpVerses.length;i++){
//    choppedVerse.push(brpVerses[i].slice(0,brpVerses[i].indexOf(':')));
// }
// choppedVerse.forEach((item, index)=>{
//    initialVerse.push(choppedVerse[index]+':'+__initRange[index]);
// })
// choppedVerse.forEach((item, index) =>{
//    lastVerse.push(choppedVerse[index]+':'+__lastRange[index]);
// })
// let stringBibleVerse = bibleVerses.toString();
// choppedVerse.forEach( (item, index)=>{
//    if(stringBibleVerse.search(initialVerse[index]) == -1 ){
//       initErrorVerses.push(initialVerse[index])
//    }
// });

// choppedVerse.forEach( (item, index)=>{
//    if(stringBibleVerse.search(lastVerse[index]) == -1 ){
//       lastErrorVerses.push(lastVerse[index])
//    }
// });
// console.log(initErrorVerses);
// console.log(lastErrorVerses);

// 
// let match = 0;
// for(let i = 0; i<brpVerses.length; i++){
//    for(let j = 0; j<bibleVerses.length; j++){
//       if(brpVerses[i] == bibleVerses[j]){
//          match++;
//       }
//    }
//    if(match == 0){
//       errorVerses.push(brpVerses[i]);
//    }
//    match = 0;
// }

// console.log(brpVerses);