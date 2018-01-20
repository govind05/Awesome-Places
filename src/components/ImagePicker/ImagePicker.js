import React, {Component} from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import ImagePick from 'react-native-image-picker';

class ImagePicker extends Component{
    state = {
        pickedImage: null
    }
    reset = () =>{
        this.setState({
            pickedImage: null
        });
    }
    imagePickedHandler = () => {
        ImagePick.showImagePicker({title: "Pick an Image", maxWidth: 800, maxHeight: 600}, res =>{
            if(res.didCancel){
                console.log('User cancelled')
            }else if(res.error){
                console.log('error', res.error)
            }else{
                this.setState({
                    pickedImage: {uri: res.uri}
                })
                this.props.onImagePicked({uri: res.uri, base64: res.data})
            }
        })
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.placeholder} >
                    <Image resizeMode='contain' source={this.state.pickedImage} style={styles.previewImage} />
                </View>
                <View style={styles.button} >
                    <Button title="Pick Image" onPress={this.imagePickedHandler}/>
                </View>
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    container:{
        width: "100%",
        alignItems: "center"
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 150
    },
    button: {
        margin: 8
    },
    previewImage: {
        width: "100%",
        height: "100%"
    }
});

export default ImagePicker;