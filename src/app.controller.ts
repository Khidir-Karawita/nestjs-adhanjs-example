import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Render('index')
  @Get()
  async getAdhanTimes(
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
  ): Promise<any> {
    if (!lat || !lng) {
      return {
        success: false,
        error: 'الرجاء إدخال خط العرض وخط الطول',
      };
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const prayerData = await this.appService.getPrayerTimes(
      latitude,
      longitude,
    );

    return {
      ...prayerData,
      inputLat: latitude,
      inputLng: longitude,
    };
  }
}
