import React from "react";
import { createStackNavigator } from '@react-navigation/stack';

import { Home } from '../screens/Home';
import { SignIn } from '../screens/SignIn';
import { AppointmentDeatils } from '../screens/AppointmentDeatils';
import { AppointmentCreate } from '../screens/AppointmentCreate';
import { useTheme } from "@react-navigation/native";
import { theme } from "../global/styles/theme";
import { useAuth } from "../hooks/auth";

const { Navigator, Screen } = createStackNavigator();

export function AuthRoutes() {
  // correção para fundo transparente
  const { colors } = useTheme();
  colors.background = 'transparent';
  const { user } = useAuth();

  return user.id ?
  (
    <Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: theme.colors.secondary100
      }
    }}
    >
      <Screen
        name="Home"
        component={Home}
      />

      <Screen
        name="AppointmentDeatils"
        component={AppointmentDeatils}
      />

      <Screen
        name="AppointmentCreate"
        component={AppointmentCreate}
      />
    </Navigator>
  )
  :
  (
    <Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: theme.colors.secondary100
      }
    }}
    >

      <Screen
        name="SignIn"
        component={SignIn}
      />

    </Navigator>
  )  ;
}
