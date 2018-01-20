import React,{Component} from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';

import DefaultInput from '../UI/DefaultInput';

const placeInput = (props) =>(
    <DefaultInput 
        touched={props.placeData.touched}
        valid={props.placeData.valid}
        placeholder="Place name" 
        value={props.placeData.value} 
        onChangeText={props.onChangeText} 
    />
);

export default placeInput;