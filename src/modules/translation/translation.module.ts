import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';

@Module({
  providers: [TranslationService],
  exports: [TranslationService],  // Export TranslationService để sử dụng ở các module khác
})
export class TranslationModule {}