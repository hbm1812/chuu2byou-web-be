import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TranslationService {
  private readonly baseURL = 'https://api.apertium.org/json/translate';

  async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      });

      if (response.data.responseStatus !== 200) {
        throw new Error(`Translation Error: ${response.data.responseDetails}`);
      }

      return response.data.responseData.translatedText;
    } catch (error) {
      console.error('Translation Error:', error);
      throw new Error('Could not translate text');
    }
  }
}
