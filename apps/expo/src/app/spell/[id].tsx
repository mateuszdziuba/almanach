import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { SplashScreen, Stack, useSearchParams } from "expo-router";

import { api } from "../../utils/api";

const Spell: React.FC = () => {
  const { id } = useSearchParams();
  if (!id || typeof id !== "string") throw new Error("unreachable");
  const { data } = api.spell.byId.useQuery({ id });
  const { width } = useWindowDimensions();

  if (!data) return <SplashScreen />;

  return (
    <SafeAreaView className="bg-[#1F104A]">
      <Stack.Screen options={{ title: data.name }} />
      <View className="h-full w-full p-4">
        <Text className="py-2 text-3xl font-bold text-white">{data.name}</Text>
        <Text className="text-white">{data.school}</Text>
        <Text className="text-white">Poziom: {data.level}</Text>
        <Text className="text-white">Komponenty: {data.components}</Text>
        <Text className="text-white">Czas rzucana: {data.castingTime}</Text>
        <Text className="text-white">Zasięg: {data.range}</Text>
        {data.area && <Text className="text-white">Obszar: {data.area}</Text>}
        {data.effect && (
          <Text className="text-white">Efekt: {data.effect}</Text>
        )}
        {data.target && <Text className="text-white">Cel: {data.target}</Text>}
        <Text className="text-white">Czas trwania: {data.duration}</Text>
        <Text className="text-white">Rzut obronny: {data.savingThrow}</Text>
        <Text className="text-white">
          Odporność na czary: {data.spellResist}
        </Text>
        <ScrollView className="py-4 text-white">
          <RenderHtml
            contentWidth={width}
            source={{ html: data.longDescription }}
            tagsStyles={{
              p: { color: "white", fontSize: 14 },
            }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Spell;
