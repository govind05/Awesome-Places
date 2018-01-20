import React, { Component } from 'react';
import { Text, View, TouchableOpacity, TouchableHighlight, StyleSheet, Animated } from 'react-native';
import {connect} from 'react-redux';
import PlaceList from '../../components/PlaceList/PlaceList';
import {getPlaces} from '../../store/actions/index';
class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }
   
    state = { 
        placesLoaded: false,
        removeAnim: new Animated.Value(1),
        loadListAnim: new Animated.Value(0)
    }

    onNavigatorEvent = event => {
        if (event.type === 'ScreenChangedEvent') {
            if (event.id === 'willAppear') {
                this.props.onLoadPlaces();
                // this.setState({
                //     placesLoaded: false
                // })
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

    placesLoadedHandler = () => {
        Animated.timing(this.state.loadListAnim, {
            toValue: 1,
            useNativeDriver: true,
            duration: 300
        }).start();
    }

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnim,{
            toValue: 0,
            useNativeDriver: true,
            duration: 500
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        })
    }
        
    itemSelectHandler = (key) => {
        const selPlace = this.props.places.find( place => place.key === key);
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selPlace.name,
            passProps: {
                selectedPlace: selPlace
            },
            animated: true,
            animationType: 'slide-horizontal',
        })
    }
    render() {
        let content = (
            <Animated.View style={{
                opacity: this.state.removeAnim,
                transform:[
                    {
                        scale: this.state.removeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, 1]
                        })
                    }
                ]
            }}>
                <TouchableOpacity onPress = {this.placesSearchHandler} >
                    <View style={styles.searchButton}> 
                        <Text style={styles.searchButtonText}>Find Places</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );

        if(this.state.placesLoaded){
            content= (
                <Animated.View  
                style= {{
                    opacity: this.state.loadListAnim,
                    transform: [
                        {
                            scale: this.state.loadListAnim.interpolate({
                                inputRange:[0, 1],
                                outputRange:[12, 1]
                            })
                        }
                    ]
                }} >
                    <PlaceList places = { this.props.places } onItemSelected = { this.itemSelectHandler } />
                </Animated.View>
            )
        }

        return (
            <View style={this.state.placesLoaded ? null : styles.buttonContainer }>
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchButton:{
        borderColor: "orange" ,
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText: {
        color: "orange",
        fontWeight: 'bold',
        fontSize: 20
    }
});
const mapStateToProps = state => {
    return{
        places: state.places.places
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onLoadPlaces : () => dispatch(getPlaces())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);