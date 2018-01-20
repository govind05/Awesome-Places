import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {connect } from 'react-redux';

import {authLogout} from '../../store/actions/index';

class SideDrawer extends Component{
    render(){
        return(
            <View style={[styles.container, {width: Dimensions.get("window").width* 0.8}]} >
                <TouchableOpacity onPress={this.props.onLogout} >
                    <View style={styles.navItem} >
                        <Icon style={styles.drawerItemIcon} name='power-settings-new' size={30} color='#aaa' />
                        <Text>Sign Out</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: "white" ,
        flex: 1,
    },
    navItem:{
        flexDirection: 'row',
        alignItems:'center',
        padding: 10,
        backgroundColor: '#eee'
    },
    drawerItemIcon:{
        marginRight: 10
    }
})

const mapDispatchToProps = dispatch =>{
    return{
        onLogout: () => dispatch(authLogout())
    }
}
export default connect(null, mapDispatchToProps)(SideDrawer);