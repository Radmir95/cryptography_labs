let dictionary = '';

let result = [];
let resultLZ78 = [];

function btn_lz77_click_encode(input) {

    dictionary = '';
    result = [];

    let output = []
    let inputString = input;

    clearTable('tbl_lz77_result_encode');
    showTable('tbl_lz77_result_encode');

    let lengthOfDictionary = 7;
    let lengthOfBuffer = 5;

    let buffer = inputString.substring(0, lengthOfBuffer);
    let unseenBuffer = inputString.substring(lengthOfBuffer);

    let currentItteration = 1;

    let searchStr = '';

    while (buffer.length > 0) {
        let lengthOfSearchingString = 1;

        searchStr = buffer.substring(0, lengthOfSearchingString);
        while (searchInDictionary(searchStr) != -1) {
            lengthOfSearchingString += 1;
            let newStr = buffer.substring(0, lengthOfSearchingString);
            if (newStr == searchStr)
                break;
            searchStr = newStr;
        }

        let l = searchStr.length - 1;

        let index = dictionary.length - dictionary.lastIndexOf(searchStr.substring(0, l));

        if (l == 0)
            index = 0;
        let newChar = searchStr.substring(l);
        let len = l;

        addValuesInTableLZ77(currentItteration, dictionary, buffer, unseenBuffer, index, len, newChar);

        result.push([index, len, newChar]);

        let addToDictionary = searchStr;

        dictionary = (dictionary + searchStr).substring((dictionary + searchStr).length - lengthOfDictionary);

        buffer = buffer.substring(searchStr.length) + unseenBuffer.substring(0, searchStr.length);
        unseenBuffer = unseenBuffer.substring(searchStr.length);

        currentItteration += 1;

    }

    addValuesInTableLZ77(currentItteration, dictionary, buffer, unseenBuffer)
}

function btn_lz77_click_decode() {
    let message = '';

    clearTable('tbl_lz77_result_decode');
    showTable('tbl_lz77_result_decode');

    decoded = document.getElementById('tbx_decoded_text');

    for (let i = 0; i < result.length; i++) {

        let t = result[i];

        let idx = t[0];
        let len = t[1];
        let char = t[2];

        if (idx == 0) {
            message += char;
            addValuesInTableLZ77Encode('( ' + idx + ' , ' + len + ' , ' + char + ' )', i + 1, char);
            continue;
        }
        let substr = message.substring(message.length - idx, message.length - idx + len);
        addValuesInTableLZ77Encode('( ' + idx + ' , ' + len + ' , ' + char + ' )', i + 1, substr + char);
        message += substr + char;
    }
    decoded.value = message;
}

function btn_lz77_click_clear() {
    clearTable('tbl_lz77_result_encode');
    clearTable('tbl_lz77_result_decode');
    hideTable('tbl_lz77_result_encode');
    hideTable('tbl_lz77_result_decode');
    document.getElementById('tbx_decoded_text').value = '';

}


function btn_lz78_click_encode(input) {
    dictionary = [];
    result = [];
    resultLZ78 = [];

    let output = []

    let inputString = input;

    clearTable('tbl_lz78_result_encode');
    showTable('tbl_lz78_result_encode');

    let itter = 1;

    for (let i = 0; i < inputString.length; i++) {

        let char = inputString.substring(i, i + 1);

        if (i == inputString.length - 1 || i == inputString.length) {
            dictionary.push(char);
            resultLZ78.push([0, char.substring(char.length - 1)]);
            continue;
        };

        let isInDict = true;
        let isLastChar = false;

        let idx = 0;

        while (isInDict) {
            isInDict = false;

            for (let j = 0; j < dictionary.length; j++) {
                let val = dictionary[j];
                if (char == val) {
                    idx = dictionary.indexOf(val) + 1;
                    isInDict = true;
                    i++;
                    newChar = inputString.substring(i, i + 1);
                    if (newChar == '') {
                        isInDict = false;
                        isLastChar = true;
                    };
                    char += newChar;
                    break;
                }
            }
        }
        dictionary.push(char);
        if (!isLastChar)
            resultLZ78.push([idx, char.substring(char.length - 1)]);
        else
            resultLZ78.push([idx, '']);

        addValuesInTableLZ78Encode(idx, char.substring(char.length - 1), itter, char);

        itter++;
    }
}

function btn_lz78_click_decode() {
    let message = '';

    clearTable('tbl_lz78_result_decode');
    showTable('tbl_lz78_result_decode');

    decoded = document.getElementById('tbx_decoded_text');

    let dict = [];

    for (let i = 1; i < resultLZ78.length + 1; i++) {

        let t = resultLZ78[i - 1];

        let idx = t[0];
        let char = t[1];

        if (idx == 0) {
            dict.push(char);

            addValuesInTableLZ78Decode(char, '( ' + idx + ' , ' + char.substring(char.length - 1) + ' )');
        } else {
            char = dict[idx - 1] + char;
            dict.push(char);

            addValuesInTableLZ78Decode(char, '( ' + idx + ' , ' + char.substring(char.length - 1) + ' )');
        }

        message += char;

    }
    decoded.value = message;
}

function btn_lz78_click_clear() {
    clearTable('tbl_lz78_result_encode');
    clearTable('tbl_lz78_result_decode');
    hideTable('tbl_lz78_result_encode');
    hideTable('tbl_lz78_result_decode');
    document.getElementById('tbx_decoded_text').value = '';
}

function addValuesInTableLZ77(itter, dict, buffer, unseenBuff, index, len, newChar) {
    let mainTbl = document.getElementById("tbl_lz77_result_encode");
    let tds = mainTbl.getElementsByTagName("td");

    let row = mainTbl.insertRow(-1);
    row.style.textAlign = 'center';

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerHTML = itter;
    cell2.innerHTML = dict == '' ? '-' : dict;
    cell3.innerHTML = buffer == '' ? '-' : buffer;
    cell4.innerHTML = unseenBuff == '' ? '-' : unseenBuff;
    cell5.innerHTML = index === undefined ? '-' : "( " + index + " , " + len + " , " + newChar + " )";
}

function addValuesInTableLZ77Encode(input, index, decode) {
    let mainTbl = document.getElementById("tbl_lz77_result_decode");
    let tds = mainTbl.getElementsByTagName("td");

    let row = mainTbl.insertRow(-1);
    row.style.textAlign = 'center';

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = input;
    cell2.innerHTML = index;
    cell3.innerHTML = decode;
}

function addValuesInTableLZ78Encode(idx, char, index, string) {
    let mainTbl = document.getElementById("tbl_lz78_result_encode");
    let tds = mainTbl.getElementsByTagName("td");

    let row = mainTbl.insertRow(-1);
    row.style.textAlign = 'center';

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = '( ' + idx + ', ' + char + ' )';
    cell2.innerHTML = index;
    cell3.innerHTML = string;
}

function addValuesInTableLZ78Decode(output, string) {
    let mainTbl = document.getElementById("tbl_lz78_result_decode");
    let tds = mainTbl.getElementsByTagName("td");

    let row = mainTbl.insertRow(-1);
    row.style.textAlign = 'center';

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);

    cell1.innerHTML = output;
    cell2.innerHTML = string;
}

function searchInDictionary(searchingString) {
    if (dictionary.length == 0)
        return -1;
    return dictionary.lastIndexOf(searchingString);
}

function showTable(elmnt) {
    document.getElementById(elmnt).style.visibility = "visible";
}

function hideTable(elmnt) {
    document.getElementById(elmnt).style.visibility = "hidden";
}

function clearTable(elmnt) {
    let mainTbl = document.getElementById(elmnt);
    let rowCount = mainTbl.rows.length;
    for (let i = rowCount - 1; i >= 1; i--) {
        mainTbl.deleteRow(i);
    }
}