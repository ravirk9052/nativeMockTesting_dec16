import {fireEvent, render, screen} from '@testing-library/react-native';
import React from 'react';
import TodoApp from '../src/Screens/TodoApp';
import {check, openSettings, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import { Platform } from 'react-native';
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
    openPicker: jest.fn(() => Promise.resolve('mocked-image-path' )),
  };
});



describe('TodoApp Component', () => {
  it('when Todo App Renders', () => {
    render(<TodoApp />);
    const lists = screen.getByTestId('FlatlistID');
    const lengthofList = lists.props.data.length;
    if (lengthofList > 0) {
      expect(lists).toBeTruthy();
    } else {
      const norecTexts = screen.getByTestId('norecText');
      expect(norecTexts).toBeTruthy();
    }
    // console.log('13==>',lists.props.data.length);
  });

  it('should add a new todo', () => {
    const re = render(<TodoApp />);

    const input = screen.getByTestId('textInputButton');
    fireEvent.changeText(input, 'New Todo Item');

    const addButton = screen.getByTestId('AddTodoText');
    fireEvent(addButton, 'press');

    const lists = screen.getByTestId('FlatlistID');
    const listRender = render(
      lists.props.renderItem({item: {id: 2, todoName: 'abc'}}),
    );

    const newTodoText = listRender.getByTestId('addTodoItem');
    expect(newTodoText).toBeDefined();
  });

  it('should edit todo', () => {
    render(<TodoApp />);
    const editButton = screen.getAllByTestId('inputEditBtn')[0];
    fireEvent(editButton, 'press');
    const modal = screen.getByTestId('modalID');
    expect(modal).toBeTruthy();

    const editInputText = screen.getByTestId('testInputEditButton');
    fireEvent.changeText(editInputText, 'Ravi kiran Patil');

    const editInputBtn = screen.getByTestId('testInputEditBtn');
    fireEvent(editInputBtn, 'press');

    expect(editInputText).toBeDefined();

  });

  it('should delete todo', () => {
    render(<TodoApp />);
    const lists = screen.getByTestId('FlatlistID');
    const lengthOfList = lists.props.data.length;
    const listRender = render(
      lists.props.renderItem({item: {id: 1, todoName: 'abc'}}),
    );
    const deleteInputBtn = screen.getByTestId('DeleteTestBtn');
    fireEvent(deleteInputBtn, 'press');
    const lengthAfterDeletion = lists.props.data.length;
    expect(lengthAfterDeletion).toBe(lengthOfList - 1);
  });



  // it('should apply whem image crop picker apply', () => {
  //   render(<TodoApp />);

  //   const imagePickerIDButton = screen.getByTestId('imagePickerID');
  //   fireEvent(imagePickerIDButton, 'press');
  // });
  it('should apply when image crop picker is applied', async () => {
    Platform.OS = 'android';
    render(<TodoApp />);

    const imagePickerIDButton = screen.getByTestId('imagePickerID');
    fireEvent.press(imagePickerIDButton);
    const cameraAccess = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);
    // console.log('115===>',cameraAccess)
    expect(cameraAccess).toBe(RESULTS.GRANTED);
  });

  it('should apply when image crop picker is applied in ios', async () => {
    Platform.OS = 'ios';
    render(<TodoApp />);

    const imagePickerIDButton = screen.getByTestId('imagePickerID');
    fireEvent.press(imagePickerIDButton);
    // console.log('123==>',PERMISSIONS)
    const cameraAccess = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    // console.log('124===>',cameraAccess)
    expect(cameraAccess).toBe(RESULTS.GRANTED);
  });

  // it('should apply when image crop picker is applied in ios', async () => {
  //   Platform.OS = 'ios';
  //   render(<TodoApp />);

  //   const imagePickerIDButton = screen.getByTestId('imagePickerID');
  //   fireEvent.press(imagePickerIDButton);
  //   // console.log('123==>',PERMISSIONS)
  //   const cameraAccess = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
  //   // console.log('124===>',cameraAccess)
  //   expect(cameraAccess).toBe(RESULTS.GRANTED);
  // });
});
