import React, { Component } from 'react';
import {Modal, View, Text, Button, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MapView from 'react-native-maps';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';

class PlaceDetail extends Component{
    state = {
        viewmode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
    };
    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles)
    }

    updateStyles = (dims) => {
        this.setState({
            viewmode: Dimensions.get("window").height > 500 ? "portrait" : "landscape"
        })
    }
    placeDeleteHandler = () => {
        this.props.onPlaceDeleted(this.props.selectedPlace.key);
        this.props.navigator.pop();
    }
    render(){
        const marker = <MapView.Marker coordinate={this.props.selectedPlace.location} />
        const location= {
            ...this.props.selectedPlace.location,
            latitudeDelta: 0.0022,
            longitudeDelta: Dimensions.get('window').width / Dimensions.get("window").height * 0.0122
        }
        return(
            <View style={this.state.viewmode === 'portrait' ? styles.portraitContainer : styles.landscapeContainer} >
                <View style={{flex:2}} >
                    <Image resizeMode='contain' style={this.state.viewmode === 'portrait' ? styles.portraitPlaceImage : styles.landscapePlaceImage} source={this.props.selectedPlace.image} />
                    <MapView
                        initialRegion={location}
                        style={this.state.viewmode === 'portrait' ? styles.portraitMap : styles.landscapeMap}
                        >
                        {marker}
                    </MapView>
                </View>
                < View style = {
                    {
                        flex: 1,
                        paddingTop: 60
                    }
                } >
                    <Text style={styles.placeName}>{this.props.selectedPlace.name}</Text>
                    <TouchableOpacity onPress={this.placeDeleteHandler}>
                        <View style={styles.deleteButton}>
                            <Icon name='delete' color='red' size={30} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
} 

const styles = StyleSheet.create({
    portraitContainer:{
        flex: 1,
        margin: 22
    },
    landscapeContainer:{
        flex: 1,
        margin: 12,
        flexDirection: 'row'
    },
    portraitPlaceImage:{
        height: "60%",
        width: '100%',
        marginBottom: "3%"
    },
    landscapePlaceImage:{
        height: '50%',
        width: "100%",
        marginRight: '3%'
    },
    placeName:{
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 28
    },
    deleteButton:{
        alignItems: 'center'
    },
    landscapeMap: {
        height: '50%',
        width: '100%',
        marginRight: '3%'
    },
    portraitMap: {
        height: "60%",
        width: '100%'
    },
})

const mapDispatchToProps = dispatch => {
    return{
        onPlaceDeleted: key => dispatch(actions.deletePlace(key))
    }
}

export default connect(null, mapDispatchToProps)(PlaceDetail);