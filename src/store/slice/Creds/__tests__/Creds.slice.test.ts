import { appStore } from '../../../store';
import { act } from '@testing-library/react';

describe('Creds slice', () => {
  it('should have initial empty state values', () => {
    const state = appStore.getState().Creds;
    expect(state.credsData).toEqual([]);
  });

  it('should update credentials data successfully', () => {
    const testCreds = [
      {
        credTitle: 'Database',
        credData: [{ name: 'User', value: 'db_user' }],
      },
    ];

    act(() => {
      appStore.getState().Creds.updateCreds(testCreds);
    });

    expect(appStore.getState().Creds.credsData).toEqual(testCreds);
  });

  it('should clear credentials data on removeCreds', () => {
    act(() => {
      appStore.getState().Creds.updateCreds([
        {
          credTitle: 'Database',
          credData: [{ name: 'User', value: 'db_user' }],
        },
      ]);
    });

    act(() => {
      appStore.getState().Creds.removeCreds();
    });

    expect(appStore.getState().Creds.credsData).toEqual([]);
  });
});
