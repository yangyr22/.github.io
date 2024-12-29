import { init_1, animate_1 } from './room1.js';
import { init_2, animate_2 } from './room2.js';
import { init_3, animate_3 } from './room3.js';
import { init_4, animate_4 } from './room4.js';
import { init_4_deep, animate_4_deep } from './room4_deep.js';
import { init_5, animate_5 } from './room5.js';
import { init_6, animate_6 } from './room6.js';

var current_room = 2;
var last_room = 0;
var temp = 0;
var mid = 0;
let keyPressed = {};
let message = "";
let is_4_deep = true;
let is_4_locked = true;
let selectElement, selecting, readElement, yesButton1, noButton1, endOfRead;
let clockElement, clockResultElement, yesButton2, noButton2;
let clock2Element, clock2ResultElement, yesButton22, noButton22;
let paperElement, paperResultElement, yesButton3, noButton3;
let pumpkinElement, pumpkinResultElement, yesButton4, noButton4;
let manElement, womanElement, mirrorElement, plantElement;
let pianoElement, pianoResultElement, pianoResult2Element, yesButton5, noButton5, yesButton52, noButton52;
let musicboxElement, musicboxResultElement, yesButton6, noButton6;
let dairyElement1, dairyElement2, dairyElement3;



selecting = false;
endOfRead = false;
selectElement = document.getElementById('select1');
readElement = document.getElementById('Read');
yesButton1 = document.getElementById('yesButton_read');
noButton1 = document.getElementById('noButton_read');

clockElement = document.getElementById('clock');
clockResultElement = document.getElementById('clockResult');
yesButton2 = document.getElementById('yesButton_clock');
noButton2 = document.getElementById('noButton_clock');


clock2Element = document.getElementById('clock2');
clock2ResultElement = document.getElementById('clock2Result');
yesButton22 = document.getElementById('yesButton_clock2');
noButton22 = document.getElementById('noButton_clock2');


paperElement = document.getElementById('paper');
paperResultElement = document.getElementById('paperResult');
yesButton3 = document.getElementById('yesButton_paper');
noButton3 = document.getElementById('noButton_paper');


pumpkinElement = document.getElementById('pumpkin');
pumpkinResultElement = document.getElementById('pumpkinResult');
yesButton4 = document.getElementById('yesButton_pumpkin');
noButton4 = document.getElementById('noButton_pumpkin');


pianoElement = document.getElementById('piano');
pianoResultElement = document.getElementById('pianoResult');
pianoResult2Element = document.getElementById('pianoResult2');
yesButton5 = document.getElementById('yesButton_piano');
noButton5 = document.getElementById('noButton_piano');
yesButton52 = document.getElementById('yesButton_piano2');
noButton52 = document.getElementById('noButton_piano2');

musicboxElement = document.getElementById('musicbox');
musicboxResultElement = document.getElementById('musicboxResult');
yesButton6 = document.getElementById('yesButton_musicbox');
noButton6 = document.getElementById('noButton_musicbox');

manElement = document.getElementById('man');
womanElement = document.getElementById('woman');
mirrorElement = document.getElementById('mirror');
plantElement = document.getElementById('plant');

yesButton1.addEventListener('click', function() {
    readElement.style.display = 'flex';
    selectElement.style.display = 'none';
    endOfRead = true;
});
noButton1.addEventListener('click', function() {
    selectElement.style.display = 'none';
    selecting = false;
});

yesButton2.addEventListener('click', function() {
    clockResultElement.style.display = 'flex';
    clockElement.style.display = 'none';
    endOfRead = true;
    items['queen'] = true;
    is_4_deep = false;
    init_4(last_room);
});
noButton2.addEventListener('click', function() {
    clockElement.style.display = 'none';
    selecting = false;
});


yesButton22.addEventListener('click', function() {
    clock2ResultElement.style.display = 'flex';
    clock2Element.style.display = 'none';
    endOfRead = true;
    room_lit[1] = true;
});
noButton22.addEventListener('click', function() {
    clock2Element.style.display = 'none';
    selecting = false;
});

yesButton3.addEventListener('click', function() {
    paperResultElement.style.display = 'flex';
    paperElement.style.display = 'none';
    done['paper'] = true;
    items['music'] = true;
    endOfRead = true;
    message = "chasing";
});
noButton3.addEventListener('click', function() {
    clockElement.style.display = 'none';
    selecting = false;
    message = "chasing";
});


yesButton6.addEventListener('click', function() {
    musicboxResultElement.style.display = 'flex';
    musicboxElement.style.display = 'none';
    room_lit[2] = true;
    endOfRead = true;
    done['musicbox'] = true;
});
noButton6.addEventListener('click', function() {
    musicboxElement.style.display = 'none';
    selecting = false;
});


yesButton4.addEventListener('click', function() {
    pumpkinResultElement.style.display = 'flex';
    pumpkinElement.style.display = 'none';
    endOfRead = true;
    is_4_locked = false;
    done['pumpkin'] = true;
    room_lit[3] = true;
});
noButton4.addEventListener('click', function() {
    pumpkinElement.style.display = 'none';
    selecting = false;
});


yesButton5.addEventListener('click', function() {
    pianoResultElement.style.display = 'flex';
    pianoElement.style.display = 'none';
});
noButton4.addEventListener('click', function() {
    pianoElement.style.display = 'none';
    selecting = false;
});
yesButton52.addEventListener('click', function() {
    window.location.href = 'gameover.html';
});
noButton52.addEventListener('click', function() {
    pianoResult2Element.style.display = 'flex';
    pianoResultElement.style.display = 'none';
    endOfRead = true;
    items['king'] = true;
    room_lit[0] = true;
    done['piano'] = true;
});

const list = ['man', 'woman', 'mirror', 'plant']
for (const key in list){
    document.getElementById('noButton_' + list[key]).addEventListener('click', function() {
        document.getElementById(list[key]).style.display = 'none';
        selecting = false;
    });
    document.getElementById('yesButton_' + list[key]).addEventListener('click', function() {
        document.getElementById(list[key]).style.display = 'none';
        selecting = false;
    });
}

let face_item = {
    'book_shelf' : false,
    'clock' : false,
    'paper' : false,
    'paper' : false,
    'man' : false,
    'woman' : false,
    'plant' : false,
    'mirror' : false,
    'piano': false,
    'musicbox': false,
    'diary': false,
};
let item_content = {
    'book_shelf' : selectElement,
    'clock' : clockElement,
    'paper' : paperElement,
    'pumpkin' : pumpkinElement,
    'man' : manElement,
    'woman' : womanElement,
    'plant' : plantElement,
    'mirror' : mirrorElement,
    'piano': pianoElement,
    'musicbox': musicboxElement,
    'diary': dairyElement1,
};
let done = {
    'book_shelf' : false,
    'clock' : false,
    'paper' : false,
    'pumpkin' : false,
    'man' : false,
    'woman' : false,
    'plant' : false,
    'mirror' : false,
    'piano': false,
    'musicbox': false,
    'diary': false,
}

let items = {
    'queen': false,
    'king': false,
    'music': false,
}
let room_lit = {
    0 : false,
    1 : false,
    2 : false,
    3 : false,
};
let all_select = {
    selectElement, readElement, 
    clockElement, clockResultElement, 
    paperElement, paperResultElement,
    pumpkinElement, pumpkinResultElement,
    manElement, womanElement,
    plantElement, mirrorElement,
    pianoElement, pianoResult2Element, pianoResultElement,
    clock2Element, clock2ResultElement,
    musicboxElement, musicboxResultElement,
    dairyElement1, dairyElement2, dairyElement3,
};

// Add keyboard listeners
document.addEventListener('keydown', function(event) {
    keyPressed[event.code] = true; 
});
document.addEventListener('keyup', function(event) {
    keyPressed[event.code] = false; 
});

function init(){
    if (current_room != temp){
        document.getElementById('chairArrow').style.display = 'none';
        if (current_room === 1) {
            init_1(last_room);
        } else if (current_room === 2) {
            init_2(last_room, room_lit);
        } else if (current_room === 3) {
            init_3(last_room, room_lit);
        } else if (current_room === 4 && is_4_locked === true) {
            current_room = last_room;
            temp = current_room;
        } else if (current_room === 4 && is_4_deep ===false) {
            init_4(last_room);
        } else if (current_room === 4 && is_4_deep === true) {
            init_4_deep(last_room);
        } else if (current_room === 5) {
            init_5(last_room);
        } else if (current_room === 6) {
            init_6(last_room);
        }
        temp = current_room;
    }
}

function animate(){
    if (current_room === 1) {
        const [info1, info2] = animate_1(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 2) {
        const [info1, info2] = animate_2(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 3) {
        const [info1, info2] = animate_3(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 4 && is_4_deep ===false) {
        const [info1, info2] = animate_4(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 4 && is_4_deep ===true) {
        const [info1, info2] = animate_4_deep(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 5) {
        const [info1, info2] = animate_5(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 6) {
        const [info1, info2] = animate_6(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    }
    if (mid != current_room){
        last_room = current_room;
        current_room = mid;
    }
}

//init and animate
function animationLoop() {
    requestAnimationFrame(animationLoop);
    if (selecting === false){
        init();
        animate();

        // handle select
        for (const key in face_item) {
            if (face_item[key] === true && done[key] === false){
                face_item[key] = false;
                const select = item_content[key]
                select.style.display = 'flex'; 
                selecting = true;
                break;
            }
        }
    }
    else{
        if (keyPressed['Space'] && endOfRead === true) {
            for (const element in all_select){
                all_select[element].style.display = 'none';
            }
            selecting = false;
            endOfRead = false;
        }
    }
}

animationLoop();
