import React, {Component} from 'react';
import {Text, View, TextInput, Button, StyleSheet,ActivityIndicator, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText';
import HeadingText from '../../components/UI/HeadingText';
import imagePlaceHolder from '../../assets/beautiful-place.jpg';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import PickLocation from '../../components/PickLocation/PickLocation';
import validate from '../../utility/checkValidity';
import {startAddPlace} from '../../store/actions/index';


class SharePlaceScreen extends Component{
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    componentWillMount(){
        this.reset();
    }

    componentDidUpdate(){
        if(this.props.placeAdded){
            this.props.navigator.switchToTab({tabIndex: 0});
            // this.props.onStartAddPlace();
        }
    }
    constructor(props){
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    reset = () => {
        this.setState({
            controls: {
                placeName: {
                    value: '',
                    valid: false,
                    validationRules: {
                        notEmpty: true
                    },
                    touched: false
                },
                location: {
                    value: null,
                    valid: false
                },
                image: {
                    value: null,
                    valid: false
                }
            }
        });
    }
    onNavigatorEvent = event => {
        if(event.type === 'ScreenChangedEvent'){
            if(event.id === 'willAppear'){
                this.props.onStartAddPlace();
            }
        }
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: 'left'
                })
            }
        }
        
    }
    placeNameChangeHandler = val => {
        //console.log(this.state.placeName.valid, this.state.placeName.value)
        this.setState(prevState => {
            return{
                controls:{
                    ...prevState.controls,
                    placeName: {
                        ...prevState.controls.placeName,
                        value: val,
                        valid: validate(val, prevState.controls.placeName.validationRules),
                        touched: true
                    }
                }
                
            } 
        })
    }
    placeAddHandler = () => {
        this.props.onAddPlace(this.state.controls.placeName.value, this.state.controls.location.value, this.state.controls.image.value);
        this.reset();
        this.imagePicker.reset();
        this.locationPicker.reset();
    };
    
    locationPickedHandler = location => {
        this.setState(prevState => {
            return {
                controls:{
                    ...prevState.controls,
                    location:{
                        value: location,
                        valid: true
                    }
                }
            };
        });
    }
    imagePickedHandler = image => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    image : {
                        value: image,
                        valid: true
                    }
                }
            };
        });
    }
    render(){
        let submitButton = (
            <Button 
                title="Share The Place!" 
                onPress={this.placeAddHandler} 
                disabled={!this.state.controls.placeName.valid 
                    || !this.state.controls.location.valid} />
        );
        if(this.props.isLoading){
            submitButton = <ActivityIndicator />;
        }
        return(
            <ScrollView >
                <View style={styles.container}>
                    <MainText><HeadingText><Text>Share a Place with us!</Text></HeadingText></MainText>
                    <ImagePicker 
                        onImagePicked={this.imagePickedHandler} 
                        ref={ref => this.imagePicker = ref} />
                    <PickLocation 
                        onLocationPicked={ this.locationPickedHandler } 
                        ref={ref => this.locationPicker = ref} />
                    <PlaceInput 
                        placeData={this.state.controls.placeName} 
                        onChangeText={this.placeNameChangeHandler} />
                    <View style={styles.button}>
                        {submitButton}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',

    },
    placeholder:{
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 150
    },
    button:{
        margin: 8
    },
  
})

const mapStateToProps = state => {
    return{
        isLoading: state.ui.isLoading,
        placeAdded: state.places.placeAdded
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAddPlace: (placeName, location, image) => dispatch(actions.addPlace(placeName, location, image)),
        onStartAddPlace: () => dispatch(startAddPlace())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);