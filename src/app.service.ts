import { Injectable } from '@nestjs/common';
import { PrayerTimes, Coordinates, CalculationMethod, Madhab } from 'adhan';
import { find } from 'geo-tz';
import * as moment from 'moment-timezone';
import 'moment/locale/ar-ma';

moment.locale('ar-ma');
const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'openstreetmap',
  timeout: 5000,
};

@Injectable()
export class AppService {
  async getPrayerTimes(
    latitude: number,
    longitude: number,
    date: Date = new Date(),
  ): Promise<any> {
    try {
      const timezones = find(latitude, longitude);
      const timezone = timezones[0] || 'UTC';

      const coordinates = new Coordinates(latitude, longitude);
      const params = CalculationMethod.MoonsightingCommittee();

      let prayerTimes = new PrayerTimes(coordinates, date, params);

      const now = new Date();
      if (now > prayerTimes.isha) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        prayerTimes = new PrayerTimes(coordinates, nextDay, params);
      }

      const geocoder = NodeGeocoder(options);
      const results = await geocoder.reverse({ lat: latitude, lon: longitude });
      const locationName =
        results[0]?.city || results[0]?.country || 'Unknown Location';

      return {
        success: true,
        date: moment(date).format('dddd, MMMM D, YYYY'),
        location: {
          latitude,
          longitude,
          timezone,
          name: locationName,
        },
        prayers: {
          fajr: {
            time: moment(prayerTimes.fajr).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.fajr.getTime(),
          },
          sunrise: {
            time: moment(prayerTimes.sunrise).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.sunrise.getTime(),
          },
          dhuhr: {
            time: moment(prayerTimes.dhuhr).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.dhuhr.getTime(),
          },
          asr: {
            time: moment(prayerTimes.asr).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.asr.getTime(),
          },
          maghrib: {
            time: moment(prayerTimes.maghrib).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.maghrib.getTime(),
          },
          isha: {
            time: moment(prayerTimes.isha).tz(timezone).format('HH:mm'),
            timestamp: prayerTimes.isha.getTime(),
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to calculate prayer times',
      };
    }
  }
}
