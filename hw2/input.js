const divTargets = document.querySelectorAll('.target');
const moveWorkspace = document.querySelector('#workspace');

let isHandDown = false;
let isClicked = false;
let clickWorks = true;
let focusedTarget = null;
let offsetCoordinateX = 0;
let offsetCoordinateY = 0;
let coordinateX = 0;
let coordinateY = 0;

let resizeX = 0;
let resizeY = 0;
let primaryWidth = 0;
let primaryHeight = 0;
let resizeWidth = 0;
let resizeHeight = 0;

let dragCoordinateX = 0;
let dragCoordinateY = 0;
let dragCoordinateXPrimary = 0;
let dragCoordinateYPrimary = 0;

let touchCoordinateX = 0;
let touchCoordinateY = 0;
let touchCoordinateXTemp = 0;
let touchCoordinateYTemp = 0;
let touchCoordinateXPrimary = 0;
let touchCoordinateYPrimary = 0;

let touchTime = 0;
let touchTimeResize = 0;
let touchResizeX1 = 0;
let touchResizeY1 = 0;
let touchResizeX2 = 0;
let touchResizeY2 = 0;

let touchState = 'pending';
let touchTargetT = null;
let touchTargetF = null;
let touchTargetE = null;


const basicMove = (e) => {
    e.preventDefault();
    if (isHandDown) {
        focusedTarget.style.left = `${e.pageX - offsetCoordinateX}px`;
        focusedTarget.style.top = `${e.pageY - offsetCoordinateY}px`;
        clickWorks = false;
    }
};

const resetBasicMove = (e) => {
    e.preventDefault();
    if (isHandDown) {
        focusedTarget.style.left = `${coordinateX}px`;
        focusedTarget.style.top = `${coordinateY}px`;
        isHandDown = false;
    }
};

const whenClickWorkspace = (e) => {
    e.preventDefault();
    if (!isClicked) {
        clearAllSelectedBox();
    }
    clickWorks = true;
    isClicked = false;
};

const clickTargetElement = (e) => {
    e.preventDefault();
    if (clickWorks) {
        clearAllSelectedBox();
        focusedTarget.style.backgroundColor = '#00f';
    }
    clickWorks = true;
    isClicked = true;
};

const doubleClickTargetElement = (e) => {
    e.preventDefault();
    isHandDown = true;
    offsetCoordinateX = e.offsetX;
    offsetCoordinateY = e.offsetY;
    document.addEventListener('mousemove', basicMove);
};

const clearAllSelectedBox = () => {
    divTargets.forEach((target) => {
        target.style.backgroundColor = 'red';
    });
};

const touchMove = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    if (touchState === 'movingTarget') {
        touchTargetF.style.left = `${clientX - touchCoordinateX}px`;
        touchTargetF.style.top = `${clientY - touchCoordinateY}px`;
        resizeX = clientX - touchCoordinateX;
        resizeY = clientY - touchCoordinateY;
    }
};


const touchDrag = (e) => {
    e.preventDefault();
    if (touchState === 'draggingTarget') {
        const [left, top] = [e.touches[0].clientX - dragCoordinateX, e.touches[0].clientY - dragCoordinateY];
        touchTargetE.style.left = `${left}px`;
        touchTargetE.style.top = `${top}px`;
        if (touchTargetE === touchTargetF) {
            [resizeX, resizeY] = [left, top];
        }
    }
};

const attachEventListeners = (target) => {
    const clickHandler = (e) => {
        e.preventDefault();
        focusedTarget = target;
        clickTargetElement(e);
    };
    target.addEventListener('click', clickHandler, false);

    const dblClickHandler = (e) => {
        e.preventDefault();
        focusedTarget = target;
        doubleClickTargetElement(e);
    };
    target.addEventListener('dblclick', dblClickHandler, false);

    const mouseDownHandler = (e) => {
        e.preventDefault();
        isHandDown = true;
        focusedTarget = target;
        offsetCoordinateX = e.offsetX;
        offsetCoordinateY = e.offsetY;
        coordinateX = e.pageX - offsetCoordinateX;
        coordinateY = e.pageY - offsetCoordinateY;
        document.addEventListener('mousemove', basicMove);
    };
    target.addEventListener('mousedown', mouseDownHandler, false);

    const mouseUpHandler = (e) => {
        e.preventDefault();
        isHandDown = false;
        document.removeEventListener('mousemove', basicMove);
    };
    target.addEventListener('mouseup', mouseUpHandler, false);
};

divTargets.forEach(attachEventListeners);

moveWorkspace.addEventListener('click', whenClickWorkspace, false);

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (['Escape', 'Esc'].includes(e.key)) {
        resetBasicMove(e);
        return false;
    }
}, false);


let lastTimeClicking = 0;
divTargets.forEach((target) => {
    target.addEventListener(
        'touchstart',
        (e) => {
            e.preventDefault();
            touchTargetT = target;
            touchCoordinateXTemp = e.touches[0].clientX - target.offsetLeft;
            touchCoordinateYTemp = e.touches[0].clientY - target.offsetTop;
            dragCoordinateX = e.touches[0].clientX - target.offsetLeft;
            dragCoordinateY = e.touches[0].clientY - target.offsetTop;
            dragCoordinateXPrimary = target.offsetLeft;
            dragCoordinateYPrimary = target.offsetTop;
        },
        false
    );

    target.addEventListener(
        'touchmove',
        (e) => {
            e.preventDefault();
            if (touchState !== "abortDragging") {
                touchTargetE = target;
                touchState = "draggingTarget";
                touchDrag(e);
            }
        },
        false
    );

    target.addEventListener(
        'touchend',
        (e) => {
            e.preventDefault();

            if (touchState === 'abortDragging') {
                touchState = touchTargetF !== null ? 'focused' : 'pending';
            } else if (touchState === 'pending' || touchState === 'focused') {
                clearAllSelectedBox();
                touchTargetF = touchTargetT;
                touchTargetF.style.backgroundColor = '#00f';
                touchState = 'touchingTarget';
                const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = target;
                touchCoordinateX = touchCoordinateXTemp;
                touchCoordinateY = touchCoordinateYTemp;
                touchCoordinateXPrimary = offsetLeft;
                touchCoordinateYPrimary = offsetTop;
                resizeX = offsetLeft;
                resizeY = offsetTop;
                resizeWidth = offsetWidth;
                resizeHeight = offsetHeight;
                primaryWidth = offsetWidth;
                primaryHeight = offsetHeight;
            }

            const time_between_taps = 200;
            if (Date.now() - lastTimeClicking < time_between_taps) {
                touchState = 'doubleTouchingTarget';
            }
            lastTimeClicking = Date.now();
        },
        false
    );
});




const touchResizing = (e) => {
    if (touchState != "resizing") return;
    let dxref = (touchResizeX1 - touchResizeX2 > 0) ? touchResizeX1 - touchResizeX2 : touchResizeX2 - touchResizeX1;
    let dyref = (touchResizeY1 - touchResizeY2 > 0) ? touchResizeY1 - touchResizeY2 : touchResizeY2 - touchResizeY1;
    let direction = (dxref > dyref) ? "x" : "y";


    
    const dx = (Math.abs(e.touches[0].clientX - e.touches[1].clientX) - dxref) / 10;
    const dy = (Math.abs(e.touches[0].clientY - e.touches[1].clientY) - dyref) / 10;

    if (direction == "x") {
        let x_ = resizeX - dx / 2;
        let width_ = resizeWidth + dx;
        if (x_ >= 0 && x_ + width_ <= window.innerWidth && width_ > 20) {
            touchTargetF.style.left = `${x_}px`;
            touchTargetF.style.width = `${width_}px`;
            resizeX = x_;
            resizeWidth = width_;
        }
    } else {
        let y_ = resizeY - dy / 2;
        let height_ = resizeHeight + dy;
        if (y_ >= 0 && y_ + height_ <= window.innerHeight && height_ > 20) {
            touchTargetF.style.top = `${y_}px`;
            touchTargetF.style.height = `${height_}px`;
            resizeY = y_;
            resizeHeight = height_;
        }
    }
};



const handleTouchStartV = (e) => {
    e.preventDefault();
    const touchCount = e.touches.length;
    const time = new Date().getTime();
    touchTime = time;

    if (['focused', 'resizing'].includes(touchState)) {
        touchTimeResize = time;

        if (touchCount === 1) {
            [touchResizeX1, touchResizeY1] = [e.touches[0].clientX, e.touches[0].clientY];
            if (time - touchTime < 200) {
                [touchResizeX2, touchResizeY2] = [e.touches[0].clientX, e.touches[0].clientY];
                moveWorkspace.addEventListener('touchmove', touchResizing, false);
                touchState = 'resizing';
            }
        } else if (touchCount === 2) {
            [touchResizeX1, touchResizeY1] = [e.touches[0].clientX, e.touches[0].clientY];
            [touchResizeX2, touchResizeY2] = [e.touches[1].clientX, e.touches[1].clientY];
            moveWorkspace.addEventListener('touchmove', touchResizing, false);
            touchState = 'resizing';
        } else if (touchCount === 3) {
            touchTargetF.style.cssText = `left: ${touchCoordinateXPrimary}px; top: ${touchCoordinateYPrimary}px; width: ${primaryWidth}px; height: ${primaryHeight}px;`;
            touchTargetF = null;
            clearAllSelectedBox();
            touchState = 'focused';
        } else {
            clearAllSelectedBox();
            touchState = 'pending';
        }
    }
};

moveWorkspace.addEventListener('touchstart', handleTouchStartV, false);


const handleTouchEnd = (e) => {
    e.preventDefault();
    const touchCount = e.touches.length;
    const time = new Date().getTime();

    switch (touchState) {
        case 'doubleTouchingTarget':
            document.addEventListener('touchmove', touchMove);
            touchState = 'movingTarget';
            break;
        case 'movingTarget':
            if (touchCount >= 1) {
                touchTargetF.style.left = `${touchCoordinateXPrimary}px`;
                touchTargetF.style.top = `${touchCoordinateYPrimary}px`;
                touchState = 'focused';
            } else if (time - touchTime < 200) {
                touchState = 'pending';
                touchCoordinateXPrimary = touchTargetF.offsetLeft;
                touchCoordinateYPrimary = touchTargetF.offsetTop;
                touchTargetF = null;
                clearAllSelectedBox();
                document.removeEventListener('touchmove', touchMove);
            }
            break;
        case 'draggingTarget':
            if (touchCount >= 1) {
                if (touchTargetF && touchTargetE === touchTargetF) {
                    [resizeX, resizeY] = [dragCoordinateXPrimary, dragCoordinateYPrimary];
                    [touchCoordinateXPrimary, touchCoordinateYPrimary] = [touchTargetE.offsetLeft, touchTargetE.offsetTop];
                }
                touchState = 'abortDragging';
                touchTargetE.style.left = `${dragCoordinateXPrimary}px`;
                touchTargetE.style.top = `${dragCoordinateYPrimary}px`;
                touchTargetE = null;
            } else if (touchTargetF) {
                touchState = 'focused';
            } else {
                touchState = 'pending';
            }
            break;
        case 'touchingTarget':
            touchState = 'focused';
            break;
        case 'focused':
            clearAllSelectedBox();
            touchState = 'pending';
            break;
        case 'resizing':
            if (touchCount === 0) {
                touchState = 'focused';
            }
            break;
        default:
            break;
    }
};

moveWorkspace.addEventListener('touchend', handleTouchEnd, false);