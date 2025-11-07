function useGeolocation() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude.toFixed(4);
      const lng = position.coords.longitude.toFixed(4);
      document.getElementById('lat').value = lat;
      document.getElementById('lng').value = lng;
      document.querySelector('form').submit();
    },
    function (error) {
      alert('Unable to get location. Please enter coordinates manually.');
    },
  );
}

function updateCurrentPrayer() {
  const prayerItems = document.querySelectorAll('.prayer-item');
  const now = new Date();
  let currentPrayer = null;
  let nextPrayerTime = null;

  prayerItems.forEach((item) => {
    item.classList.remove('highlighted');
    const prayerName = item.querySelector('.prayer-name').textContent.trim();

    const timestamp = parseInt(item.getAttribute('data-timestamp'));
    const prayerDate = new Date(timestamp);

    if (prayerDate > now && (!nextPrayerTime || prayerDate < nextPrayerTime)) {
      nextPrayerTime = prayerDate;
      currentPrayer = { name: prayerName, time: prayerDate, element: item };
    }
  });

  if (currentPrayer) {
    currentPrayer.element.classList.add('highlighted');
    document.getElementById('currentPrayerName').textContent =
      currentPrayer.name;

    const updateCountdown = () => {
      const now = new Date();
      const diff = currentPrayer.time - now;

      if (diff > 0) {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        document.getElementById('countdown').textContent =
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      } else {
        updateCurrentPrayer();
      }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  } else {
    console.log('No next prayer found today');
  }
}

if (document.querySelector('.prayer-item')) {
  updateCurrentPrayer();
}
