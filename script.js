const clock = document.querySelector('.clock');

const CLOCK_HTML = `
<div class="clock">
        <div class="clock-hand hour"></div>
        <div class="clock-hand minute"></div>
</div>
`
const digitGroups = document.querySelectorAll('.digit-group');

digitGroups.forEach(group => {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 2; i++ ) {
        const digitDiv = document.createElement('div');
        digitDiv.classList.add('digit');

        digitDiv.innerHTML = Array(24).fill(CLOCK_HTML).join('');

        fragment.appendChild(digitDiv);
    }

    group.appendChild(fragment);
})


const angles = {
    a: [0, 90], // ┌ 
    b: [90, 180], // ┐
    c: [180, 270], // ┘
    d: [0, 270], // └
    e: [0, 180], // ─
    f: [270, 90], // |
    n: [135, 135],
}

const digitAngle = {
    0: [
        angles.a, angles.e, angles.e, angles.b,
        angles.f, angles.a, angles.b, angles.f,
        angles.f, angles.f, angles.f, angles.f,
        angles.f, angles.f, angles.f, angles.f,
        angles.f, angles.d, angles.c, angles.f,
        angles.d, angles.e, angles.e, angles.c
    ],
    1: [
        angles.a, angles.e, angles.b, angles.n,
        angles.d, angles.b, angles.f, angles.n,
        angles.n, angles.f, angles.f, angles.n,
        angles.n, angles.f, angles.f, angles.n,
        angles.a, angles.c, angles.d, angles.b,
        angles.d, angles.e, angles.e, angles.c,
    ],
    2: [
        angles.a, angles.e, angles.e, angles.b,
        angles.d, angles.e, angles.b, angles.f,
        angles.a, angles.e, angles.c, angles.f,
        angles.f, angles.a, angles.e, angles.c,
        angles.f, angles.d, angles.e, angles.b,
        angles.d, angles.e, angles.e, angles.c
    ],
    3: [
        angles.a, angles.e, angles.e, angles.b,
        angles.d, angles.e, angles.b, angles.f,
        angles.n, angles.a, angles.c, angles.f,
        angles.n, angles.d, angles.b, angles.f,
        angles.a, angles.e, angles.c, angles.f,
        angles.d, angles.e, angles.e, angles.c
    ],
    4: [
        angles.a, angles.b, angles.a, angles.b,
        angles.f, angles.f, angles.f, angles.f,
        angles.f, angles.d, angles.c, angles.f,
        angles.d, angles.e, angles.b, angles.f,
        angles.n, angles.n, angles.f, angles.f,
        angles.n, angles.n, angles.d, angles.c,
    ],
    5: [
        angles.a, angles.e, angles.e, angles.b, // ┌ ─ ─ ┐
        angles.f, angles.a, angles.e, angles.c, // │ ┌ ─ ┘
        angles.f, angles.d, angles.e, angles.b, // | └ ─ ┐
        angles.d, angles.e, angles.b, angles.f, // └ ─ ┐ │
        angles.a, angles.e, angles.c, angles.f, // ┌ ─ ┘ │
        angles.d, angles.e, angles.e, angles.c  // └ ─ ─ ┘
    ],
    6: [
        angles.a, angles.e, angles.e, angles.b, // ┌ ─ ─ ┐
        angles.f, angles.a, angles.e, angles.c, // │ ┌ ─ ┘
        angles.f, angles.d, angles.e, angles.b, // │ └ ─ ┐
        angles.f, angles.a, angles.b, angles.f, // │ ┌ ┐ |
        angles.f, angles.d, angles.c, angles.f, // │ └ ┘ |
        angles.d, angles.e, angles.e, angles.c  // └ ─ ─ ┘
    ],
    7: [
        angles.a, angles.e, angles.e, angles.b, // ┌ ─ ─ ┐
        angles.d, angles.e, angles.b, angles.f, // └ ─ ┐ │
        angles.n, angles.n, angles.f, angles.f, // · · │ │
        angles.n, angles.n, angles.f, angles.f, // · · │ │
        angles.n, angles.n, angles.f, angles.f, // · · │ │
        angles.n, angles.n, angles.d, angles.c  // · · └ ┘
    ],
    8: [
        angles.a, angles.e, angles.e, angles.b, // ┌ ─ ─ ┐
        angles.f, angles.a, angles.b, angles.f, // │ ┌ ┐ |
        angles.f, angles.d, angles.c, angles.f, // │ └ ┘ |
        angles.f, angles.a, angles.b, angles.f, // │ ┌ ┐ |
        angles.f, angles.d, angles.c, angles.f, // │ └ ┘ |
        angles.d, angles.e, angles.e, angles.c  // └ ─ ─ ┘
    ],
    9: [
        angles.a, angles.e, angles.e, angles.b, // ┌ ─ ─ ┐
        angles.f, angles.a, angles.b, angles.f, // │ ┌ ┐ |
        angles.f, angles.d, angles.c, angles.f, // │ └ ┘ |
        angles.d, angles.e, angles.b, angles.f, // └ ─ ┐ │
        angles.n, angles.n, angles.f, angles.f, // · · │ │
        angles.n, angles.n, angles.d, angles.c  // · · └ ┘
    ],
}

const allDigits = Array.from(document.querySelectorAll('.digit')).map(digit => {
    return Array.from(digit.querySelectorAll('.clock')).map(clock => ({
        hourHand: clock.querySelector('.hour'),
        minuteHand: clock.querySelector('.minute')
    }));
});


const previousTimeDigits = [null, null, null, null, null, null] 

function updateDigits() {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, second: '2-digit' });
    const timeDigits = time.replace(/\D/g, '').split("").map(Number);
    
    timeDigits.forEach((timeDigit, timeDigitIndex) => {
        if (timeDigit !== previousTimeDigits[timeDigitIndex]) {
            const digitAngles = digitAngle[timeDigit];
            const clocks = allDigits[timeDigitIndex];
            
            clocks.forEach((clock, index) => {
                clock.hourHand.style.rotate = `${digitAngles[index][0]}deg`;
                clock.minuteHand.style.rotate = `${digitAngles[index][1]}deg`;
            });
        }
        previousTimeDigits[timeDigitIndex] = timeDigit;
    })

    // digits.forEach((digit, digitIndex) => {
    //     const clocks = digit.querySelectorAll('.clock');
    //     clocks.forEach((clock, index) => {
    //         clock.querySelector('.hour').style.rotate = `${digitAngle[timeDigits[digitIndex]][index][0]}deg`;
    //         clock.querySelector('.minute').style.rotate = `${digitAngle[timeDigits[digitIndex]][index][1]}deg`;
    //     });
    // })
}

function syncClock() {
    updateDigits(); // Run immediately
    
    const now = new Date();
    // Calculate how many milliseconds are left in the current second
    const delay = 1000 - now.getMilliseconds();

    setTimeout(() => {
        updateDigits();
        // Now that we are synced to the "top" of the second, 
        // start the 1000ms loop.
        setInterval(updateDigits, 1000);
    }, delay);
}

syncClock();

