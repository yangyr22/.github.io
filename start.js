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
let render_deep = true;
let is_4_locked = true;
let die, gameover;
let selectElement, selecting, readElement, yesButton1, noButton1, endOfRead;
let clockElement, clockResultElement, yesButton2, noButton2;
let clock2Element, clock2ResultElement, yesButton22, noButton22;
let paperElement, paperResultElement, yesButton3, noButton3;
let pumpkinElement, pumpkinResultElement, yesButton4, noButton4;
let manElement, womanElement, mirrorElement, plantElement;
let pianoElement, pianoResultElement, pianoResult2Element, yesButton5, noButton5, yesButton52, noButton52;
let musicboxElement, musicboxResultElement, yesButton6, noButton6;
let saveElement, saveResultElement, yesButton7, noButton7;
let doorElement, Button;
let option,minimap, XUp;

function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    let copy = obj.constructor();
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepCopy(obj[attr]);
      }
    }
    return copy;
}

selecting = false;
endOfRead = false;
die = false;
XUp = true;
option = document.getElementById('optionsDiv');
minimap = document.getElementById('minimapDiv');
gameover = document.getElementById('GameOverDiv');
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

saveElement = document.getElementById('save');
saveResultElement = document.getElementById('saveResult');
yesButton7 = document.getElementById('yesButton_save');
noButton7 = document.getElementById('noButton_save');

manElement = document.getElementById('man');
womanElement = document.getElementById('woman');
mirrorElement = document.getElementById('mirror');
plantElement = document.getElementById('plant');

doorElement = document.getElementById('door');
Button = document.getElementById('Button');

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
    items['king'] = false;
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
    paperElement.style.display = 'none';
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


yesButton6.addEventListener('click', function() {
    musicboxResultElement.style.display = 'flex';
    musicboxElement.style.display = 'none';
    room_lit[2] = true;
    endOfRead = true;
    done['musicbox'] = true;
    items['queen'] = false;
});
noButton6.addEventListener('click', function() {
    musicboxElement.style.display = 'none';
    selecting = false;
});


yesButton7.addEventListener('click', function() {
    saveResultElement.style.display = 'flex';
    saveElement.style.display = 'none';
    save_done = done;
    save_is_4_deep = is_4_deep;
    save_is_4_locked = is_4_locked;
    save_items = items;
    save_room_lit = room_lit;
    endOfRead = true;
});
noButton7.addEventListener('click', function() {
    saveElement.style.display = 'none';
    selecting = false;
});


Button.addEventListener('click', function() {
    doorElement.style.display = 'none';
    selecting = false;
});

yesButton5.addEventListener('click', function() {
    pianoResultElement.style.display = 'flex';
    pianoElement.style.display = 'none';
    items['music'] = false;
});
noButton5.addEventListener('click', function() {
    pianoElement.style.display = 'none';
    selecting = false;
});
yesButton52.addEventListener('click', function() {
    die = true;
    pianoResultElement.style.display = 'none';
    selecting = false;
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
    'cat': false,
    'door': false,
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
    'cat': saveElement,
    'door': doorElement,
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
    'cat': false,
    'door': false,
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
    saveElement, saveResultElement,
};

let save_is_4_deep = is_4_deep;
let save_is_4_locked = is_4_locked;
let save_done = deepCopy(done);
let save_items = deepCopy(items);
let save_room_lit = deepCopy(room_lit);

// Add keyboard listeners
document.addEventListener('keydown', function(event) {
    keyPressed[event.code] = true; 
});
document.addEventListener('keyup', function(event) {
    keyPressed[event.code] = false; 
});

// Add gamepad control

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected:", e.gamepad);
});
window.addEventListener("gamepaddisconnected", function(e) {
    console.log("Gamepad disconnected:", e.gamepad);
});

function updateGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    const gamepad = gamepads[0];
    if (gamepad) {
        // 左侧转轮 -> wasd（移动）
        if (gamepad.axes[0] < -0.5) {
            keyPressed["KeyA"] = true;
        } else {
            keyPressed["KeyA"] = false;
        }

        if (gamepad.axes[0] > 0.5) {
            keyPressed["KeyD"] = true;
        } else {
            keyPressed["KeyD"] = false;
        }

        if (gamepad.axes[1] < -0.5) {
            keyPressed["KeyW"] = true;
        } else {
            keyPressed["KeyW"] = false;
        }

        if (gamepad.axes[1] > 0.5) {
            keyPressed["KeyS"] = true;
        } else {
            keyPressed["KeyS"] = false;
        }

        // 右侧转轮 -> ArrowLeft / ArrowRight（视角转动）
        if (gamepad.axes[2] < -0.5) {
            keyPressed["ArrowLeft"] = true;
        } else {
            keyPressed["ArrowLeft"] = false;
        }

        if (gamepad.axes[2] > 0.5) {
            keyPressed["ArrowRight"] = true;
        } else {
            keyPressed["ArrowRight"] = false;
        }

        // A 键 -> 空格 / Enter
        if (gamepad.buttons[0].pressed) {
            keyPressed["Space"] = true;
        } else {
            keyPressed["Space"] = false;
        }

        // B 键 -> X / Escape
        if (gamepad.buttons[1].pressed) {
            keyPressed["KeyX"] = true;
        } else {
            keyPressed["KeyX"] = false;
        }

        // X 键 -> Shift
        if (gamepad.buttons[2].pressed) {
            keyPressed["ShiftLeft"] = true;
        } else {
            keyPressed["ShiftLeft"] = false;
        }

        
        if (gamepad.buttons[3].pressed) {
            keyPressed["Escape"] = true;
        } else {
            keyPressed["Escape"] = false;
        }
    }
}

function init(){
    if (current_room != temp){
        document.getElementById('chairArrow').style.display = 'none';
        document.getElementById('ghostArrow').style.display = 'none';
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
            render_deep = false;
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
        let all_lit = true;
        for (const key in room_lit){
            if (room_lit[key] === false){
                all_lit = false;
            }
        }
        const [info1, info2] = animate_2(current_room, last_room, keyPressed, face_item, message, items, all_lit);
        mid = info1;
        face_item = info2;
    } else if (current_room === 3) {
        const [info1, info2, info3, info4] = animate_3(current_room, last_room, keyPressed, face_item, message, items, is_4_locked);
        mid = info1;
        face_item = info2;
        die = info3;
        message = info4;
    } else if (current_room === 4 && render_deep ===false) {
        const [info1, info2] = animate_4(current_room, last_room, keyPressed, face_item, message, items);
        mid = info1;
        face_item = info2;
    } else if (current_room === 4 && render_deep ===true) {
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
    updateGamepadInput();
    if (die === true){
        gameover.style.display = 'block';
        if (keyPressed['Space'] === true){
            die = false;
            gameover.style.display = 'none';
            done = deepCopy(save_done);
            is_4_deep = save_is_4_deep;
            is_4_locked = save_is_4_locked;
            items = deepCopy(save_items);
            room_lit = deepCopy(save_room_lit);
            current_room = 2;
            last_room = 0;
            temp = 0;
            mid = 0;
        }
    }
    else if (selecting === false){
        if (keyPressed['KeyX'] === true && XUp === true){
            if (option.style.display === 'none'){
                option.style.display = 'block';
                minimap.style.display = 'block';
            }
            else{
                option.style.display = 'none';
                minimap.style.display = 'none';
            }
        }
        for (const key in items){
            if (items[key] === true){
                document.getElementById(key).style.display = 'none';
            } else {
                document.getElementById(key).style.display = 'block';
            }
        }
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
        
        if ('KeyX' in keyPressed && keyPressed['KeyX'] === true){
            XUp = false;
        }
        else{
            XUp = true;
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
