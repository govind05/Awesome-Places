import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Platform } from 'react-native';

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS === 'android' ? 'map' : 'add-location', 30),
        Icon.getImageSource('share',30),
        Icon.getImageSource('menu', 30)
    ]).then(source => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "awesome-places.FindPlaceScreen",
                    title: "Find Place",
                    label: "Find Place",
                    icon: source[0],
                    navigatorButtons:{
                        leftButtons:[
                            { 
                                icon: source[2],
                                title: 'menu',
                                id: 'sideDrawerToggle' 
                            }
                        ]
                    }
                },
                {
                    screen: "awesome-places.SharePlaceScreen",
                    title: "Share Place",
                    label: "Share Place",
                    icon: source[1],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: source[2],
                                title: 'menu',
                                id: 'sideDrawerToggle' 
                            }
                        ]
                    }
                }
            ],
            appStyle: {
               
                tabBarSelectedButtonColor: 'orange',
            },
            drawer:{
                left:{
                    screen:"awesome-places.SideDrawer"
                }
            }
        })
    });
    
};

export default startTabs;
