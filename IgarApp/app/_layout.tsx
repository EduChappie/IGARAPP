import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { StatusBar, View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, G, Rect } from "react-native-svg";
import React from "react";

SystemUI.setBackgroundColorAsync("#001A23");

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: "#001A23" },
  };

  const rotasComNavbar = [
    "/home_user", 
    "/home_ong", 
    "/perfil_pf", 
    "/historico",
    "/pesquisa"
  ];
  
  const mostrarNavbar = rotasComNavbar.includes(pathname);

  return (
    <ThemeProvider value={CustomDarkTheme}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: "#001A23" },
        }}
      />

      {mostrarNavbar && (
        <View style={styles.tabBarWrapper} pointerEvents="box-none">
          <LinearGradient
            colors={["rgba(0, 26, 35, 0)", "#001A23"]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <BlurView intensity={20} tint="dark" style={styles.tabBarContainer}>
            
            <TouchableOpacity 
              style={styles.tabIcon} 
              activeOpacity={0.7}
              onPress={() => router.push("/home_user")}
            >
              <HomeIcon active={pathname === "/home_user" || pathname === "/home_ong"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabIcon} 
              activeOpacity={0.7}
              onPress={() => router.push("/perfil_pf")}
            >
              <UserIcon active={pathname === "/perfil_pf"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabIcon} 
              activeOpacity={0.7}
              onPress={() => { /* router.push("/pesquisa") */ }}
            >
              <FishNavIcon active={pathname === "/pesquisa"} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tabIcon} 
              activeOpacity={0.7}
              onPress={() => router.push("/historico")}
            >
              <RefreshIcon active={pathname === "/historico"} />
            </TouchableOpacity>

          </BlurView>
        </View>
      )}
    </ThemeProvider>
  );
}

// ==========================================
// COMPONENTE BASE DA BOLINHA
// ==========================================
const ActiveCircle = () => (
  <G>
    <Path d="M0 27C0 12.0883 12.0883 0 27 0C41.9117 0 54 12.0883 54 27V28C54 42.9117 41.9117 55 27 55C12.0883 55 0 42.9117 0 28V27Z" fill="#EEE82C" />
    <Path d="M27 0.5C41.6355 0.5 53.5 12.3645 53.5 27V28C53.5 42.6355 41.6355 54.5 27 54.5C12.3645 54.5 0.5 42.6355 0.5 28V27C0.5 12.3645 12.3645 0.5 27 0.5Z" stroke="#001A23" strokeOpacity="0.4" />
  </G>
);

// ==========================================
// ÍCONES COM EFEITO "BOLINHA"
// ==========================================

const HomeIcon = ({ active }: { active: boolean }) => (
  <Svg width="54" height="55" viewBox="0 0 54 55" fill="none">
    {active && <ActiveCircle />}
    <G transform="translate(2, 1)"> 
        <Path d="M26.4951 29.4937C25.1144 29.4937 23.9951 30.6129 23.9951 31.9937V36.9937H28.9951V31.9937C28.9951 30.6129 27.8758 29.4937 26.4951 29.4937Z" fill={active ? "#001A23" : "#E8F1F2"} />
        <Path d="M30.6618 31.994V36.994H33.9951C35.3758 36.994 36.4951 35.8747 36.4951 34.494V26.8932C36.4953 26.4603 36.3271 26.0443 36.0259 25.7332L28.9443 18.0773C27.6948 16.7254 25.5859 16.6424 24.2339 17.8919C24.1697 17.9513 24.1078 18.0131 24.0485 18.0773L16.9793 25.7307C16.6691 26.043 16.495 26.4655 16.4951 26.9057V34.494C16.4951 35.8747 17.6144 36.994 18.9951 36.994H22.3284V31.994C22.344 29.7217 24.1787 27.866 26.3938 27.8126C28.683 27.7574 30.6443 29.6446 30.6618 31.994Z" fill={active ? "#001A23" : "#E8F1F2"} />
    </G>
  </Svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <Svg width="54" height="55" viewBox="0 0 54 55" fill="none">
    {active && <ActiveCircle />}
    <G transform="translate(19.5, 17.5)">
        <Path d="M7.5 10C10.2614 10 12.5 7.76142 12.5 5C12.5 2.23858 10.2614 0 7.5 0C4.73858 0 2.5 2.23858 2.5 5C2.5 7.76142 4.73858 10 7.5 10Z" fill={active ? "#001A23" : "#E8F1F2"} />
        <Path d="M7.5 11.6659C3.35977 11.6705 0.00460937 15.0257 0 19.1659C0 19.6261 0.373086 19.9992 0.83332 19.9992H14.1666C14.6269 19.9992 15 19.6261 15 19.1659C14.9954 15.0257 11.6402 11.6705 7.5 11.6659Z" fill={active ? "#001A23" : "#E8F1F2"} />
    </G>
  </Svg>
);

const FishNavIcon = ({ active }: { active: boolean }) => (
  <Svg width="54" height="55" viewBox="0 0 54 55" fill="none">
    {active && <ActiveCircle />}
    <G transform="translate(17, 17.5)">
        <Path d="M13.0121 0.047019C14.6454 -0.156607 16.7134 0.324674 18.1888 1.03657C18.875 1.34862 19.1452 2.29373 19.3883 2.98817C20.3374 5.69948 20.1715 8.5195 18.9637 11.1296C17.8607 13.4992 15.9077 15.3153 13.5311 16.1813C11.0277 17.1156 8.26993 16.9484 5.88605 15.7179C5.88163 15.8367 5.86442 15.9614 5.84833 16.0793C5.70853 17.1049 5.65187 18.1405 5.52906 19.1677C5.51506 19.2847 5.47217 19.4741 5.42081 19.5742C5.32184 19.7638 5.15424 19.9036 4.95577 19.9623C4.70396 20.0384 4.56267 19.9951 4.3488 19.8698C4.13128 19.6953 3.87336 19.4109 3.67497 19.2031L2.61816 18.0963L0.979161 16.3822C0.737662 16.1262 0.354518 15.7815 0.163908 15.4973C-0.248379 14.8825 0.171496 14.2912 0.819234 14.2345C2.00826 14.1305 3.16814 13.9828 4.34022 13.8192C4.21351 12.9204 4.0483 11.9451 3.99123 11.0369C3.88684 9.37522 4.16009 7.59675 4.80079 6.07254C4.91835 5.79286 5.1634 5.41589 5.31043 5.10522C4.8095 5.0027 4.32675 4.85234 3.81307 4.80199C2.94613 4.71698 2.33141 5.04398 2.01598 3.94206C2.06577 3.70971 2.1411 3.57646 2.29146 3.40095C3.49363 1.99761 5.65222 1.06062 7.46122 1.12921C7.76089 1.15329 8.2252 1.14344 8.50343 1.21355C9.01062 1.34139 8.84561 1.38659 9.30153 1.10346C9.62636 0.901734 10.0603 0.726712 10.425 0.595244C11.2619 0.299038 12.1311 0.114856 13.0121 0.047019Z" fill={active ? "#001A23" : "#E8F1F2"} />
    </G>
  </Svg>
);

const RefreshIcon = ({ active }: { active: boolean }) => (
  <Svg width="54" height="55" viewBox="0 0 54 55" fill="none">
    {active && <ActiveCircle />}
    <G transform="translate(17, 17.5)">
        <Path d="M19.1567 9.16667C18.9357 9.16667 18.7237 9.25447 18.5674 9.41074C18.4111 9.56703 18.3233 9.77899 18.3233 10C18.3301 11.9377 17.6637 13.8177 16.4379 15.3185C15.2122 16.8193 13.5033 17.8478 11.6032 18.2282C9.70321 18.6086 7.73004 18.3173 6.02099 17.4041C4.31194 16.4908 2.97312 15.0124 2.23336 13.2214C1.49361 11.4304 1.39884 9.43811 1.96527 7.58501C2.53169 5.7319 3.72414 4.13305 5.33879 3.06173C6.95345 1.9904 8.89006 1.51313 10.8176 1.71148C12.7452 1.90982 14.544 2.77148 15.9067 4.14917C15.8793 4.15664 15.8514 4.16249 15.8233 4.16667H13.3233C13.1023 4.16667 12.8904 4.25446 12.7341 4.41074C12.5778 4.56703 12.49 4.77899 12.49 5C12.49 5.22101 12.5778 5.43298 12.7341 5.58926C12.8904 5.74554 13.1023 5.83333 13.3233 5.83333H15.8233C16.4864 5.83333 17.1223 5.56994 17.5911 5.1011C18.0599 4.63226 18.3233 3.99637 18.3233 3.33333V0.833333C18.3233 0.61232 18.2355 0.400358 18.0793 0.244078C17.923 0.0877974 17.711 0 17.49 0C17.269 0 17.057 0.0877974 16.9007 0.244078C16.7445 0.400358 16.6567 0.61232 16.6567 0.833333V2.55417C14.9505 1.02878 12.7724 0.135139 10.4865 0.0225855C8.20065 -0.0899677 5.94538 0.585381 4.09757 1.93578C2.24976 3.28618 0.921366 5.22982 0.334358 7.44192C-0.25265 9.65402 -0.0627097 12.0006 0.87244 14.0895C1.80759 16.1784 3.4313 17.883 5.47224 18.9187C7.51318 19.9543 9.84772 20.2581 12.0857 19.7794C14.3238 19.3006 16.3297 18.0683 17.7684 16.2884C19.207 14.5084 19.9913 12.2887 19.99 10C19.99 9.77899 19.9022 9.56703 19.7459 9.41074C19.5896 9.25447 19.3777 9.16667 19.1567 9.16667Z" fill={active ? "#001A23" : "#E8F1F2"} />
        <Path d="M8.7377 6C8.54205 6 8.35442 6.07772 8.21607 6.21607C8.07772 6.35442 8 6.54205 8 6.73771V10.4262C8.00004 10.6219 8.07779 10.8095 8.21615 10.9478L10.4293 13.1609C10.5684 13.2953 10.7547 13.3696 10.9482 13.368C11.1416 13.3663 11.3266 13.2887 11.4634 13.1519C11.6002 13.0151 11.6778 12.8301 11.6794 12.6367C11.6811 12.4433 11.6068 12.2569 11.4724 12.1178L9.47541 10.1208V6.73771C9.47541 6.54205 9.39769 6.35442 9.25934 6.21607C9.12099 6.07772 8.93336 6 8.7377 6Z" fill={active ? "#001A23" : "#E8F1F2"} />
    </G>
  </Svg>
);

// ==========================================
// ESTILOS
// ==========================================
const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 44, 59, 0.4)",
    borderRadius: 999,
    height: 63,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    width: 258,
    borderWidth: 0.7,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  tabIcon: {
    width: 54,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
});