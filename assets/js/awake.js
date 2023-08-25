
const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', (e) => {
            console.log(e);
//            wakeLockCheckbox.checked = false;
//            statusDiv.textContent = 'Wake Lock was released';
            console.log('Wake Lock was released');
        });
//        wakeLockCheckbox.checked = true;
//        statusDiv.textContent = 'Wake Lock is active';
        console.log('Wake Lock is active');
//        alert('awake')
    } catch (e) {
//        wakeLockCheckbox.checked = false;
//        statusDiv.textContent = `${e.name}, ${e.message}`;
        console.error(`${e.name}, ${e.message}`);
    }
};
requestWakeLock();