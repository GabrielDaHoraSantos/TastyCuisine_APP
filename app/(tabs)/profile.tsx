import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { usuariosAPI } from '../(auth)/api';

const avatar = require('../../assets/images/profile.png');

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type ProfileRow = {
  icon: IoniconName;
  label: string;
  value?: string;
};

const sections: Array<{ title: string; data: ProfileRow[] }> = [
  {
    title: 'Account',
    data: [
      { icon: 'person-circle-outline', label: 'Manage Profile' },
      { icon: 'lock-closed-outline', label: 'Password & Security' },
      { icon: 'notifications-outline', label: 'Notifications' },
      { icon: 'language-outline', label: 'Language', value: 'English' },
    ],
  },
  {
    title: 'Preferences',
    data: [
      { icon: 'newspaper-outline', label: 'About Us' },
      { icon: 'contrast-outline', label: 'Theme', value: 'Light' },
      { icon: 'calendar-outline', label: 'Appointments' },
    ],
  },
  {
    title: 'Support',
    data: [{ icon: 'help-circle-outline', label: 'Help Center' }],
  },
];

const tabs: Array<{ icon: IoniconName; activeIcon: IoniconName; label: string; route?: string }> = [
  { icon: 'home-outline', activeIcon: 'home', label: 'Home', route: '/(tabs)/home' },
  { icon: 'compass-outline', activeIcon: 'compass', label: 'Explore', route: '/(tabs)/search' },
  { icon: 'heart-outline', activeIcon: 'heart', label: 'Favorites', route: '/(tabs)/favorites' },
  { icon: 'business-outline', activeIcon: 'business', label: 'Agents' },
  { icon: 'person-outline', activeIcon: 'person', label: 'Profile', route: '/(tabs)/profile' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: 'Guest user',
    email: 'Sign in to sync your profile',
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');

        if (!userId) {
          setLoadingProfile(false);
          return;
        }

        const response = await usuariosAPI.getById(userId);
        const user = response.data as any;

        if (user) {
          setProfile({
            name: user.nomeCompleto || user.nomeDeUsuario || 'User',
            email: user.gmail || '',
          });
        } else {
          const cachedName = await AsyncStorage.getItem('userName');
          const cachedEmail = await AsyncStorage.getItem('userEmail');
          setProfile({
            name: cachedName || 'User',
            email: cachedEmail || '',
          });
        }
      } catch (err) {
        const cachedName = await AsyncStorage.getItem('userName');
        const cachedEmail = await AsyncStorage.getItem('userEmail');
        setProfile({
          name: cachedName || 'User',
          email: cachedEmail || '',
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F6F6" />
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.profileCard}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.profileText}>
              {loadingProfile ? (
                <ActivityIndicator color="#BA531B" />
              ) : (
                <>
                  <Text style={styles.name}>{profile.name}</Text>
                  <Text style={styles.email}>{profile.email}</Text>
                </>
              )}
            </View>
          </View>

          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.card}>
                {section.data.map((item, index) => {
                  const isLast = index === section.data.length - 1;

                  return (
                    <TouchableOpacity
                      key={item.label}
                      activeOpacity={0.72}
                      style={[styles.row, isLast && styles.lastRow]}
                    >
                      <View style={styles.iconSlot}>
                        <Ionicons name={item.icon} size={24} color="#2B2B2B" />
                      </View>
                      <Text style={styles.rowLabel}>{item.label}</Text>
                      {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
                      <Ionicons name="arrow-forward" size={20} color="#2B2B2B" />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomBar}>
          {tabs.map((tab) => {
            const isActive = tab.label === 'Profile';

            return (
              <TouchableOpacity
                key={tab.label}
                activeOpacity={0.75}
                style={styles.tabItem}
                onPress={() => tab.route && router.push(tab.route as never)}
              >
                <Ionicons
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={28}
                  color={isActive ? '#0B0B0B' : '#A8A8A8'}
                />
                <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 118,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 84,
  },
  title: {
    color: '#111111',
    fontSize: 25,
    fontWeight: '800',
  },
  profileCard: {
    minHeight: 118,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 28,
    shadowColor: '#D8D8D8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 3,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginRight: 22,
    backgroundColor: '#E8E8E8',
  },
  profileText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    color: '#141414',
    fontSize: 24,
    fontWeight: '800',
  },
  email: {
    color: '#C3C3C3',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 7,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    color: '#A4A4A4',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#E1E1E1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 2,
  },
  row: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EFEFEF',
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  iconSlot: {
    width: 36,
    alignItems: 'center',
    marginRight: 12,
  },
  rowLabel: {
    flex: 1,
    color: '#232323',
    fontSize: 20,
    fontWeight: '800',
  },
  rowValue: {
    color: '#3B3B3B',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 18,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 22 : 12,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#DCDCDC',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  tabLabel: {
    color: '#8F8F8F',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 5,
  },
  activeTabLabel: {
    color: '#111111',
    fontWeight: '900',
  },
});
