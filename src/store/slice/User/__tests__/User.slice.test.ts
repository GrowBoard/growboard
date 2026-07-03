import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('User slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Profile;
    expect(state.userData.bio).toBe('');
    expect(state.userData.phone_number).toEqual([]);
  });

  it('should update user profile successfully', () => {
    const testProfile = {
      bio: 'New Bio',
      phone_number: ['123'],
      socialLink: {
        facebook: 'fb',
        instagram: 'ig',
        github: 'gh',
        x: 'x',
        website: 'web',
        linkedin: 'li',
      },
      hobbies: ['h1'],
    };

    act(() => {
      appStore.getState().Profile.updateProfile(testProfile);
    });

    expect(appStore.getState().Profile.userData).toEqual(testProfile);
  });

  it('should clear user profile on removeProfile', () => {
    act(() => {
      appStore.getState().Profile.updateProfile({
        bio: 'New Bio',
        phone_number: ['123'],
        socialLink: {
          facebook: 'fb',
          instagram: 'ig',
          github: 'gh',
          x: 'x',
          website: 'web',
          linkedin: 'li',
        },
        hobbies: ['h1'],
      });
    });

    act(() => {
      appStore.getState().Profile.removeProfile();
    });

    expect(appStore.getState().Profile.userData.bio).toBe('');
  });
});
