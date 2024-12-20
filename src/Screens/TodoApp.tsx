import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import AwesomeIcons from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';

interface IProps {}

interface IState {
  todoArray: {id: number; todoName: string}[];
  addedItem: string;
  modalVisible: boolean;
  editedItem: ITodo;
}

interface ITodo {
  id: number;
  todoName: string;
}

interface IItem {
  index: number;
  item: ITodo;
  // eachItem: {
  //   index: number;
  //   item: ITodo;
  // }
}

export class TodoApp extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      todoArray: [
        {id: 1, todoName: 'Ravi kiran'},
        {id: 2, todoName: 'Naveen kumar'},
        {id: 3, todoName: 'Ajith kumar'},
      ],
      addedItem: '',
      modalVisible: false,
      editedItem: {id: 0, todoName: ''},
    };
  }

  RenderTodoItem = (eachItem: IItem) => {
    // console.log('99==>render',eachItem)
    const todoItem: ITodo = eachItem.item;
    const todoIndex = eachItem.index + 1;
    const todoName = todoItem.todoName;

    return (
      <View style={styles.mainContainer}>
        <View style={styles.inputBorders}>
          <View>
            <Text style={styles.todoText} testID="addTodoItem">
              {todoIndex}. {todoName}
            </Text>
          </View>
          <View style={styles.buttonBorders}>
            <TouchableOpacity
              onPress={() => this.onPressEditButton(eachItem.item)}
              testID="inputEditBtn"
              style={styles.buttonEdit}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                <Icons name="pencil" size={20} />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => this.onPressDeleteButton(eachItem.item)}
              testID="DeleteTestBtn">
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                <AwesomeIcons name="trash" size={20} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  onPressAddBtn = (item: string) => {
    // console.log('50-krian')
    if (item) {
      this.setState(prevState => ({
        ...prevState,
        todoArray: [
          ...prevState.todoArray,
          {id: this.state.todoArray.length + 1, todoName: item},
        ],
        addedItem: '',
      }));
    } else {
      Alert.alert('Please fill the input...');
    }
  };

  onChangeTodoText = (text: string) => {
    this.setState({addedItem: text});
  };

  onPressEditButton = (item: ITodo) => {
    this.setState({editedItem: item, modalVisible: true});
  };

  onPressDeleteButton = (item: ITodo) => {
    const {todoArray} = this.state;
    const filteredArray = todoArray.filter(filterItem => {
      return filterItem.id !== item.id;
    });
    this.setState({todoArray: filteredArray});
  };

  onChangeEditText = (item: string) => {
    this.setState(prevState => ({
      ...prevState,
      editedItem: {id: prevState.editedItem.id, todoName: item},
    }));
  };

  onPressEditTodo = () => {
    const {todoArray, editedItem} = this.state;
    todoArray.forEach(item => {
      if (item.id === editedItem.id) {
        item.todoName = editedItem.todoName;
      }
    });
    this.setState({modalVisible: false});
  };

onPressImagePicker = async () => {
  Platform.OS === 'android' 
    ? await this.handleAndroidImagePicker()  
    : Platform.OS === 'ios' 
      ? await this.handleIosImagePicker()
      : console.log('Unsupported platform');
};

handleAndroidImagePicker = async () => {
  const cameraAccess = await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES);

  cameraAccess === RESULTS.GRANTED
    ? await this.pickImage()  
    : cameraAccess === RESULTS.BLOCKED
      ? openSettings('application')  
      : console.log('Permission denied on Android');  
};

pickImage = async () => {
  try {
    const pickImage = await ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: true,
    });
    console.log('160===>', pickImage.path); 
  } catch (error) {
    console.log('Error picking image:', error);
  }
};

handleIosImagePicker = async () => {
  const checkedStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

  checkedStatus === RESULTS.GRANTED
    ? await this.pickImage() 
    : checkedStatus === RESULTS.BLOCKED
    ? openSettings('application') 
    : console.log('Permission denied on iOS'); 
};


  render() {
    const {todoArray, addedItem, modalVisible, editedItem} = this.state;
    return (
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={addedItem}
            testID="textInputButton"
            placeholder="Add Todo"
            placeholderTextColor={'black'}
            onChangeText={this.onChangeTodoText}
          />
          <TouchableOpacity
            style={styles.addTodoBtn}
            onPress={() => this.onPressAddBtn(addedItem)}>
            <Text style={styles.addTodoText} testID="AddTodoText">
              Add
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          {todoArray.length > 0 ? (
            <FlatList
              data={todoArray}
              renderItem={this.RenderTodoItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.flatListStyle}
              testID="FlatlistID"
            />
          ) : (
            <View style={styles.norecords} testID="norecText">
              <Text style={styles.norecordstext}>No Todos Available...</Text>
            </View>
          )}
        </View>

        {/* <View>
          {todoArray.length > 0 ? (
            <View>
              {todoArray.map((item, index) => {
                //  console.log('176==>', eachItem)
                 const eachItem = {index, item}
                //  console.log('178==>',eachItem)
                return(
               
                <View key={index}>
                <this.RenderTodoItem eachItem={eachItem} />
                </View>
                )
              }
               
              )}
            </View>
          ) : (
            <View style={styles.norecords} testID="norecText">
              <Text style={styles.norecordstext}>No Todos Available...</Text>
            </View>
          )}
        </View> */}

        <View style={styles.imageContainer}>
          <Text style={styles.imageCropText}>Image Crop Picker </Text>
          <TouchableOpacity
            style={styles.imageCropBtn}
            onPress={this.onPressImagePicker}
            testID="imagePickerID">
            <Text>Pick Image</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          // onRequestClose={() => this.setState({modalVisible: false})}
          testID="modalID">
          <TouchableWithoutFeedback
            testID="touchableModalID"
            onPress={() => this.setState({modalVisible: false})}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={styles.updateTextContainer}>
                  <Text style={styles.updateText}>Update Todo</Text>
                </View>
                <View style={styles.editContainer}>
                  <TextInput
                    placeholder="Edit Todo"
                    value={editedItem.todoName}
                    onChangeText={this.onChangeEditText}
                    testID="testInputEditButton"
                    style={[styles.inputText, styles.editInput]}
                  />

                  <TouchableOpacity
                    style={styles.addTodoBtn}
                    onPress={this.onPressEditTodo}
                    testID="testInputEditBtn">
                    <Text style={styles.addTodoText}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputText: {
    borderWidth: 1,
    width: responsiveWidth(75),
    height: 40,
    borderColor: 'gray',
    borderRadius: 12,
  },
  addTodoBtn: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginLeft: 5,
    backgroundColor: '#21261f',
    width: responsiveWidth(15),
    borderRadius: 12,
  },
  addTodoText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
  },
  input: {
    height: 40,
    width: '75%',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    alignItems: 'center',
    width: '25%',
    backgroundColor: '#21261f',
    padding: 10,
    height: 40,
    cursor: 'pointer',
    marginLeft: 9,
    borderRadius: 12,
  },
  inputBorders: {
    borderWidth: 0.5,
    padding: 7,
    color: 'green',
    margin: 5,
    flexDirection: 'row',
    width: responsiveWidth(90),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    borderColor: 'gray',
  },
  buttonEdit: {
    alignItems: 'center',
    backgroundColor: 'orange',
    padding: 10,
    width: 50,
    height: 40,
    cursor: 'pointer',
    marginRight: 10,
    borderRadius: 12,
  },
  buttonDelete: {
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'red',
    padding: 10,
    width: 60,
    height: 40,
    cursor: 'pointer',
    marginRight: 0,
    borderRadius: 12,
  },
  buttonBorders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    width: '45%',
    justifyContent: 'center',
  },
  inputButton: {
    flexDirection: 'row',
  },
  flatListStyle: {
    marginTop: 25,
  },
  todoText: {
    fontSize: 16,
    fontWeight: 700,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    width: responsiveWidth(90),

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  editInput: {
    width: responsiveWidth(60),
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.1,
    marginBottom: 20,
  },
  updateText: {
    fontSize: 18,
    fontWeight: 700,
  },
  norecords: {
    borderWidth: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  norecordstext: {
    fontSize: 20,
    fontWeight: 700,
  },
  imageContainer: {
    borderWidth: 0.1,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  imageCropText: {
    fontSize: 16,
    fontWeight: 700,
  },
  imageCropBtn: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 12,
  },
});

export default TodoApp;
