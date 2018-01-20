import React, { Component } from 'react';
import { View, Button, Image, StyleSheet, Text, Dimensions } from 'react-native';
import MapView from 'react-native-maps';

class PickLocation extends Component {
    componentWillMount(){
        this.reset();
    }
    reset = () => {
        this.setState({
            focusedLocation: {
                latitude: 37.7900352,
                longitude: -122.4013726,
                latitudeDelta: 0.0022,
                longitudeDelta: Dimensions.get('window').width / Dimensions.get("window").height * 0.0122
            },
            pickedLocation: false
        })
    }
    locationChangeHandler = (event) => {
        const coords = event.nativeEvent.coordinate;
        this.map.animateToRegion({
            ...this.state.focusedLocation,
            latitude: coords.latitude,
            longitude: coords.longitude
        })
        this.setState(prevState=> {
            return{
                focusedLocation:{
                    ...prevState.focusedLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude
                },
                pickedLocation: true
            }
        });
        this.props.onLocationPicked({
            latitude: coords.latitude,
            longitude: coords.longitude
        })
    }
    getLocationHandler = () => {
        navigator.geolocation.getCurrentPosition( pos => {
            const coordsEvent ={
                nativeEvent:{
                    coordinate:{
                        longitude: pos.coords.longitude,
                        latitude: pos.coords.latitude
                    }
                }
            }
            this.locationChangeHandler(coordsEvent);
        },
    err =>{
        alert('Location fetch failed!! Please pick location manually.')
    })
    }
    render() {
        let marker = null;
        if(this.state.pickedLocation){
            marker = <MapView.Marker coordinate={this.state.focusedLocation} />
        }
        return (
            <View style={styles.container}>
                <MapView 
                    initialRegion = {this.state.focusedLocation} 
                    region={!this.state.pickedLocation ? this.state.focusedLocation : null}
                    style={styles.map}    
                    onPress={this.locationChangeHandler}
                    ref={ref => this.map = ref}
                >
                    {marker}
                </MapView>
                <View style={styles.button}>
                    <Button title="Locate Me" onPress={this.getLocationHandler} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center"
    },
    map:{
        width: '100%',
        height: 250
    },
    button: {
        margin: 8
    },
});

export default PickLocation;