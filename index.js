require('dotenv').config();

const {RTMClient } = require('@slack/rtm-api');

var status = 0;

const tokenModule = require('./data/token');
const token = tokenModule.getToken();
const ignoreMesssage = '궁금한 정보를 입력해주세요.\n● 학사 일정\n● 학과 안내\n● 오늘 밥 뭐야\n● 이번주 뭐나와';
console.log(token);

const rtm = new RTMClient(token);

const test_channel = "C04C774L88Y";
const test_uID = "U0486MGJDAL"
const testResultList = [0];

const successMessage = function (testNum) {
    return `테스트 #${testNum} 성공`;
}

const failMessage = function (testNum) {
    return `테스트 #${testNum} 실패`;
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
};

rtm.start ();


rtm.on('ready', async () => {
    const rdy1 = await rtm.sendMessage("테스트를 시작한다.", test_channel);
    console.log ("테스트 루틴 시작이다.");
    status++;
    console.log('테스트 #1 시작');
    const rdy2 = await rtm.sendMessage("hi", test_channel);
});
rtm.on('message', async (message) => {
    let text = message.text;
    if(text === ignoreMesssage) {
        return;
    }

    console.log("받은메시지 : " , text);

    if (message.user === test_uID){

        switch (status) {
            case 1:
                if(text === "Hello~ My dariling♡" || text === "Nice to meet you!" || text === "Hi~ My cute♡"){
                    console.log(successMessage(1));
                    testResultList.push(1);
                }else{
                    console.log(failMessage(1));
                    testResultList.push(0);
                }
                rtm.sendMessage("4", test_channel); 
                status = 2;
                console.log("테스트 #2 시작");
                break;
            case 2:
                if(text === "The result is 16"){
                    console.log(successMessage(2));
                    testResultList.push(1);
                }else{
                    console.log(failMessage(2));
                    testResultList.push(0);
                }
                rtm.sendMessage('학사 일정', test_channel);
                status = 3.1;
                console.log('테스트 #3-1 시작');
                break;
            case 3.1:
                if(text === '안내 받을 날짜를 이야기해주세요.예시) 12/25') {
                    console.log(successMessage(3.1));
                } else {
                    console.log (failMessage(3.1));
                }
                rtm.sendMessage('12/21', test_channel);
                status = 3.2;
                console.log('테스트 #3-2 시작');
                break;
            case 3.2:
                if(text === '12/21은 종강입니다.') {
                    console.log(successMessage(3.2));
                    testResultList.push(1);
                } else {
                    console.log (failMessage(3.2));
                    testResultList.push(0);
                }
                rtm.sendMessage('학과 안내', test_channel);
                status = 4.1;
                console.log('테스트 #4-1 시작');
                break;
            case 4.1:
                if(text === '안내 받을 학과를 이야기해주세요. 예시) Computer Science and Engineering') {
                    console.log(successMessage(4.1));
                } else {
                    console.log(failMessage(4.1));
                }
                rtm.sendMessage('Computer Science and Engineering', test_channel);
                status = 4.2;
                console.log('테스트 #4-2 시작');
                break;
            case 4.2:
                if(text === 'Computer Science and Engineering - College of Engineering Building 7, 224입니다.') {
                    console.log(successMessage(4.2));
                    testResultList.push(1);
                } else {
                    console.log(failMessage(4.2));
                    testResultList.push(0);
                }
                rtm.sendMessage('오늘 밥 뭐야', test_channel);
                status = 5;
                console.log('테스트 #5 시작');
                break;
            case 5:
                if(text.includes('평점은') || text === '주말은 운영하지 않습니다.') {
                    console.log(successMessage(5));
                    testResultList.push(1);
                } else {
                    console.log(failMessage(5));
                    testResultList.push(0);
                }
                rtm.sendMessage('이번주 뭐나와', test_channel);
                status = 6;
                console.log('테스트 #6 시작');
                break;
            case 6:
                if(text.includes('월요일') && text.includes('화요일') && text.includes('수요일') && text.includes('목요일') && text.includes('금요일')) {
                    console.log(successMessage(6));
                    testResultList.push(1);
                } else {
                    console.log(failMessage(6));
                    testResultList.push(0);
                }
                console.log('모든 테스트 종료');
                let resultMessage = '테스트가 종료되었습니다.\n';
                for(let i=1; i<=6; i++) {
                    if(testResultList[i] === 1) {
                        resultMessage += `테스트 #${i} 성공\n`;
                    } else if(testResultList[i] === 0) {
                        resultMessage += `테스트 #${i} 실패 *\n`;
                    }
                }
                rtm.sendMessage(resultMessage, test_channel);
                process.exit(1);
                break;
        }
    }else{
        rtm.sendMessage("테스트 채널에서 떠들지마세요.", test_channel);
    }
});