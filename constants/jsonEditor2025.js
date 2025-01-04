// pls use proper naming methods PLEASE
// from the verse months remove the sermon notes for a while\
// in a verse split it by part and use it

import { month_0, month_1, month_2, month_3, month_4, month_5, month_6, month_7, month_8, month_9, month_10, month_11 } from './data2025.js'; // add "type":"module" to package.json to make it work

import fs from 'fs'; // maybe some alternatives benj?

const verseMonths = [month_0, month_1, month_2, month_3, month_4, month_5, month_6, month_7, month_8, month_9, month_10, month_11]

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


const JSONMAKER = () => {
        
    let newData2025 = {};
    let x = 0;
    for(let i=0; i<months.length ;i++){

    let newArrMonth = [];
    let newVerseMonth = verseMonths[i].split("\n");
    for(let j=0; j<newVerseMonth.length ;j++){
        let obj = {
            id: x++,
            date: j+1,
            month: months[i],
            verse: newVerseMonth[j],
        }
        newArrMonth.push(obj);
        obj = {};
    }
    newData2025[months[i]] = newArrMonth;
    }

    const newData = JSON.stringify(newData2025);
    fs.writeFile("2025.json", newData, function(err, result) {
    if(err) console.log('error', err);
    });

}

const queryMaker = () => {
    let data = JSON.parse(fs.readFileSync("./2025.json"));

    //let monthLength = Object.keys(data).length;

    let query = "";
    for(let i = 0; i < verseMonths.length; i++){
    let month = months[i];
    let newVerse = verseMonths[i].split("\n");
        for(let j = 0; j < newVerse.length; j++){
            let day = j+1;
            let verse = newVerse[j];

            query += `INSERT INTO brp2025 (month, day, verse, completion) VALUES ("${month}", ${day}, "${verse}", "none");\n`
        }
    }

    console.log(query);
}

//queryMaker();


const checkInBible = (book, chapter, verseRangeStart, verseRangeEnd) => {
    //use the data from esv.json as reference for checking
    const data = JSON.parse(fs.readFileSync("./esv.json"));
    let scripture = [book, chapter, verseRangeStart, verseRangeEnd];

    if(book == "Psalm"){
        book = "Psalms";
    }

    let result = data.verses.some(function (item) { // actual fetching according to the extracted values
        if(item.book_name == book && item.chapter == chapter){
        
            if(verseRangeEnd !== null){
                
                if(verseRangeStart < verseRangeEnd){
                    if(item.verse == verseRangeEnd){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            } 
            else{
                if (item.verse == verseRangeStart) {
                    return true
                }else{
                    return false;
                }
            }
                
        }else{ return false }
        
    });

    return result ? "Matched" : scripture;
}

//Checks every verse in the brp and outputs the verses that has errors
const verseChecker = (scripture) => {

    let verse = scripture;
    let splitVerse = verse.split(":"); //put a verse index here ex. verse[0]

    let book = splitVerse[0].split(" ").length == 2 ? // checks if the array has 2 or more items
        splitVerse[0].split(" ")[0] :   //the book as it is
        `${splitVerse[0].split(" ")[0]} ${splitVerse[0].split(" ")[1]}`; // gets the first and 2nd element and joins them in case the length of the array is 3

    let chapter = splitVerse[0].split(" ").length == 2 ? 
        Number(splitVerse[0].split(" ")[1]) :
        Number(splitVerse[0].split(" ")[2]);

    let verseRangeStart = Number(splitVerse[1]?.split("-")[0]);

    let verseRangeEnd = splitVerse[1]?.split("-").length == 1 ? null :
        Number(splitVerse[1]?.split("-")[1]);

    return checkInBible(book, chapter, verseRangeStart, verseRangeEnd); 
}

//console.log(verseChecker("1 Peter 5:1-11"))

const brpChecker = () => {
    let brpVerses = verseMonths.toString().split("\n");
    let matchedCount = 0;
    let errorVerses = [];
    brpVerses.forEach((item)=>{
        
        if(verseChecker(item) == 'Matched'){
            matchedCount += 1;
        }else{
            errorVerses.push(verseChecker(item));
        }
    })
    return errorVerses;
}

//console.log(brpChecker());
