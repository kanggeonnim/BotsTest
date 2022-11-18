require('dotenv').config();

const {RTMClient } = require('@slack/rtm-api');

var status = 0;

const tokenModule = require('./data/data');
const token = tokenModule.getToken();
console.log(token);

const rtm = new RTMClient(token);

var test_channel = "C04C774L88Y";
var test_uID = "U049P40JG90"
// if(status == 1){
//     // 1은 인사를 위한 루틴
//     if(text == "Hello"){
//         console.log("테스트 #1 성공.");
//     }else{
//         console.log("테스트 #1 실패.");
//     }
// }
// status
rtm.start ();

rtm.on ('ready', async ()=> {
    const rdy1 = await rtm.sendMessage("테스트를 시작한다.", test_channel);
    console.log ("테스트 루틴 시작이다.");
    status++;
    const rdy2 = await rtm.sendMessage("hi", test_channel);
});
rtm.on ('message', function (message) {
    var text = message.text;

    console.log("받은메시지 : " , text);

    if (message.user == test_uID){

        switch (status) {
            case 1:
                if(text == "Hello~ My dariling♡" || text == "Nice to meet you!" || text == "Hi~ My cute♡"){
                    console.log ("테스트 #1 성공 ");
                }else{
                    console.log ("테스트 #1 실패 ");
                    process.exit(1);
                }
                rtm. sendMessage ("4", test_channel); 
                status++;
                console. log ("테스트 #2 시 작 ");
                break;
            case 2:
                if(text == "The result is 16"){
                    console.log ("테스트 #2 성공 ");
                }else{
                    console.log ("테 스트 #2 실패 ");
                    process.exit(1);
                }
        }
    }else{
        rtm.sendMessage("테스트 채널에서 떠들지마세요.", test_channel);
    }
});