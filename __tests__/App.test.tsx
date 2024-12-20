/**
 * @format
 */

import React from 'react';
import 'react-native';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {it} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-vector-icons/SimpleLineIcons', () => 'Icons');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'AwesomeIcons');
jest.mock('react-native-permissions', () => {
  return {
    check: jest.fn(() => Promise.resolve('denied')), 
    request: jest.fn(() => Promise.resolve('granted')),
    PERMISSIONS: {
      ANDROID: {
        READ_MEDIA_IMAGES: 'android.permissions.READ_MEDIA_IMAGES',
      },
      IOS: {
        PHOTO_LIBRARY: 'ios.permissions.PHOTO_LIBRARY',
      },
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      BLOCKED: 'blocked',
    },
    openSettings: jest.fn(), 
  };
});

jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn(() => Promise.resolve({ path: 'mocked-image-path' })),
  };
});


it('renders correctly', () => {
  renderer.create(<App />);
});
