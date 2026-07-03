import { cleanProfileFormValues } from '../util';
import { ProfileFormValues } from '../types';

describe('cleanProfileFormValues', () => {
  it('should filter out empty or whitespace-only phone numbers and keep others', () => {
    const input: ProfileFormValues = {
      bio: 'Developer bio',
      phone_number: ['1234567890', '', '   ', '0987654321'],
      socialLink: {
        facebook: 'fb',
        instagram: 'ig',
        github: 'gh',
        x: 'x',
        website: 'site',
        linkedin: 'li',
      },
      hobbies: ['coding', 'reading'],
    };

    const expected: ProfileFormValues = {
      bio: 'Developer bio',
      phone_number: ['1234567890', '0987654321'],
      socialLink: {
        facebook: 'fb',
        instagram: 'ig',
        github: 'gh',
        x: 'x',
        website: 'site',
        linkedin: 'li',
      },
      hobbies: ['coding', 'reading'],
    };

    expect(cleanProfileFormValues(input)).toEqual(expected);
  });

  it('should return empty phone number array if all are empty or whitespace', () => {
    const input: ProfileFormValues = {
      bio: 'Bio',
      phone_number: ['', '  ', ''],
      socialLink: {
        facebook: '',
        instagram: '',
        github: '',
        x: '',
        website: '',
        linkedin: '',
      },
      hobbies: [],
    };

    const expected: ProfileFormValues = {
      bio: 'Bio',
      phone_number: [],
      socialLink: {
        facebook: '',
        instagram: '',
        github: '',
        x: '',
        website: '',
        linkedin: '',
      },
      hobbies: [],
    };

    expect(cleanProfileFormValues(input)).toEqual(expected);
  });
});
