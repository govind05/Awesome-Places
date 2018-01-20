import React, {Component} from 'react';
import {View, Text, Button, ActivityIndicator, TextInput, StyleSheet, Dimensions, ImageBackground, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DefaultInput';
import HeadingText from '../../components/UI/HeadingText';
import MainText from '../../components/UI/MainText';
import backgroundImage from '../../assets/background.jpg';
import ButtonWithBackground from '../../components/UI/ButtonWithBackground/ButtonWithBackground';
import validate from '../../utility/checkValidity';
import {tryAuth, authAutoSignIn } from '../../store/actions/index';

class AuthScreen extends Component{
    state = {
        viewmode: Dimensions.get("window").height > 500 ? "portrait" : "landscape" ,
        authmode: 'login',
        controls:{
            email:{
                value: '',
                valid: false,
                validationRules:{
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: '',
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: '',
                valid: false,
                validationRules: {
                    toEqual: 'password'
                },
                touched: false
            }
        }

    };
    constructor(props){
        super(props);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentDidMount(){
        this.props.onAutoSignIn()
    }

    componentWillUnmount(){
        Dimensions.removeEventListener("change", this.updateStyles)
    }

    updateStyles = (dims)=> {
          this.setState({
                viewmode: Dimensions.get("window").height > 500 ? "portrait" : "landscape" 
            })
    }
    authHandler = () => {
        authData= {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value
        }
        this.props.onTryAuth( authData, this.state.authmode );
    }

    updateAuthModeHandler = () => {
        this.setState(prevState => {
            return{
                authmode: prevState.authmode === 'login' ? 'signup' : 'login'
            }
        })
    }
    updateInputHandler = (key, val) => {
        let connectedValues= {};
        if (this.state.controls[key].validationRules.toEqual){
            const equalControl = this.state.controls[key].validationRules.toEqual;
            const equalValue = this.state.controls[equalControl].value;
            connectedValues = {
                ...connectedValues,
                toEqual: equalValue
            }
        }
        if(key === 'password'){
            
            connectedValues={
                ...connectedValues,
                toEqual: val
            }
        }
        this.setState(prevState => {
            return{
                controls:{
                    ...prevState.controls,
                    confirmPassword:{
                        ...prevState.controls.confirmPassword,
                        valid: key ==='password' 
                            ? validate(prevState.controls.confirmPassword.value, 
                                prevState.controls.confirmPassword.validationRules, connectedValues) 
                            : prevState.controls.confirmPassword.valid
                    },
                    [key]:{
                        ...prevState.controls[key],
                        value: val,
                        valid: validate(val, prevState.controls[key].validationRules, connectedValues),
                        touched: true
                    },
                    
                }
            }
        })
    }
    render(){
        let headingText = null;
        let confirmPasswordControl = null;
        let submitButton = (
            <ButtonWithBackground
                color='#29aaf4'
                onPress={this.authHandler}
                disabled={!this.state.controls.confirmPassword.valid
                    && this.state.authmode === 'signup'
                    || !this.state.controls.email.valid
                    || !this.state.controls.password.valid}
            >
                Submit
            </ButtonWithBackground>
        );

        if (this.state.viewmode === 'portrait'){
            headingText=(
                <HeadingText>Please Log In</HeadingText>
            )
        }
        if(this.state.authmode === 'signup'){
            confirmPasswordControl = (
                <View style={this.state.viewmode === "portrait" ? styles.portraitpasswordWrapper : styles.landscapepasswordWrapper}>
                    <DefaultInput style={styles.input}
                        placeholder="Confirm Password"
                        onChangeText={(val) => this.updateInputHandler('confirmPassword', val)}
                        value={this.state.controls.confirmPassword.value}
                        valid={this.state.controls.confirmPassword.valid}
                        touched={this.state.controls.confirmPassword.touched}
                        secureTextEntry={true}
                    />
                </View>
            );
        }

        if(this.props.isLoading){
            submitButton= <ActivityIndicator />;
        }
        return(
            <ImageBackground source={backgroundImage} style={styles.backgroundImage} >
                <KeyboardAvoidingView style={styles.container} behavior= 'padding' >
                    <MainText>
                        {headingText}
                    </MainText>
                    <ButtonWithBackground color='#29aaf4' onPress={this.updateAuthModeHandler} >Switch to {this.state.authmode === 'login' ? 'Sign Up' : 'Log In' }</ButtonWithBackground>
                    <TouchableWithoutFeedback onPress= {Keyboard.dismiss} >
                        <View style={styles.inputContainer} >
                            <DefaultInput style={styles.input} 
                                placeholder="Your E-Mail Address" 
                                onChangeText = {(val) => this.updateInputHandler('email', val)} 
                                value= {this.state.controls.email.value}
                                valid= {this.state.controls.email.valid} 
                                touched= {this.state.controls.email.touched}
                                keyboardType = 'email-address'
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                            />
                            <View style={this.state.viewmode === "portrait" || this.state.authmode === 'login' ? styles.portraitpasswordContainer : styles.landscapepasswordContainer } >
                                <View style={this.state.viewmode === "portrait" || this.state.authmode === 'login' ? styles.portraitpasswordWrapper: styles.landscapepasswordWrapper}>
                                    <DefaultInput style={styles.input} 
                                        placeholder="Password" 
                                        onChangeText={(val) => this.updateInputHandler('password', val)} 
                                        value={this.state.controls.password.value}
                                        valid={this.state.controls.password.valid}
                                        touched={this.state.controls.password.touched}
                                        secureTextEntry={true}
                                    />
                                </View>    
                                {confirmPasswordControl}    
                            </View>    
                        </View>
                    </TouchableWithoutFeedback>
                    {submitButton}
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    inputContainer: {
        width: "80%"
    },
    backgroundImage:{
        width: "100%",
        flex: 1
    },
    input: {
        backgroundColor: '#eee',
        borderColor: '#bbb'
    },
    landscapepasswordContainer:{
        flexDirection : 'row',
        justifyContent: 'space-between'
    },
    portraitpasswordContainer:{
        flexDirection : 'column',
        justifyContent: 'flex-start'
    },
    landscapepasswordWrapper:{
        width:  '45%'
    } ,   
    portraitpasswordWrapper:{
        width:  '100%'
    }    
})

const mapStateToProps = state => {
    return{
        isLoading: state.ui.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAutoSignIn : () => dispatch(authAutoSignIn()),
        onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);