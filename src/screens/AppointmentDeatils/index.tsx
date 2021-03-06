import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { View, ImageBackground, Text, FlatList, Alert, Share, Platform } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { Background } from '../../components/Background';
import { Header } from "../../components/Header";
import { Fontisto } from '@expo/vector-icons';
import { theme } from "../../global/styles/theme";
import * as Linking from 'expo-linking';

import BannerImg from '../../assets/banner.png';
import { styles } from "./styles";
import { ListHeader } from "../../components/ListHeader";
import { Member, MemberProps } from "../../components/Member";
import { ListDivider } from "../../components/ListDivider";
import { ButtonIcon } from "../../components/ButtonIcon";
import { AppointmentProps } from "../../components/Appointment";
import { api } from "../../services/api";
import { Load } from "../../components/Load";

type Params = {
  guildSelected: AppointmentProps;
}

type GuildWidget = {
  id: string;
  name: string;
  instant_invite: string;
  members: MemberProps[];
  presence_count: number;
}

export function AppointmentDeatils() {
  const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const { guildSelected } = route.params as Params;

  async function fetchGuildWidget () {
    try {
      const response = await api.get(`guilds/${guildSelected.guild.id}/widget.json`);
      setWidget(response.data);
    } catch (error) {
      Alert.alert('Verifique as configurações do servidor. Será que o Widget está habilitado?');
    } finally {
      setLoading(false);
    }
  }

  function handleShareInvitation() {
    const message = Platform.OS === 'ios'
      ? `Junte-se a ${guildSelected.guild.name}`
      : widget.instant_invite;

      Share.share({
        message,
        url: widget.instant_invite
      });
  }

  function handleOpenGuild() {
    Linking.openURL(`https://discord.com/channels/${widget.id}`);
  }

  useEffect(() => {
    fetchGuildWidget();
  }, []);

  return <Background>
    <Header
      title="Detahles"
      action={
        guildSelected.guild.owner &&
        <BorderlessButton onPress={handleShareInvitation}>
          <Fontisto
            name="share"
            size={24}
            color={theme.colors.primary}
          />
        </BorderlessButton>
      }
    />

    <ImageBackground
      style={styles.banner}
      source={BannerImg}
    >
      <View style={styles.bannerContent}>
        <Text style={styles.title}> { guildSelected.guild.name } </Text>
        <Text style={styles.subtitle}>
          { guildSelected.description }
        </Text>
      </View>

    </ImageBackground>

    {
      loading ? <Load /> :
      <>
        <ListHeader
          title="Jogadores"
          subtitle={`Total ${widget.members.length}`}
        />


        <FlatList
          data={widget.members}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Member data={item} />
          )}

          ItemSeparatorComponent={() => <ListDivider isCentered />}
          style={styles.members}
        />
      </>
    }


    <View style={styles.footer}>
      <ButtonIcon title="Entrar na partida" onPress={handleOpenGuild}/>
    </View>

  </Background>;
};
