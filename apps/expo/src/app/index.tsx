import React, { useEffect, useState } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";

import { api, type RouterOutputs } from "../utils/api";
import { druidTable, modTable } from "./druid";
import { type Spell } from ".prisma/client";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getValueFor(key: string) {
  const result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

const SpellCard: React.FC<{
  spell: RouterOutputs["spell"]["all"][number];
}> = ({ spell }) => {
  const router = useRouter();

  return (
    <View className="flex flex-row rounded-lg bg-white/10 p-4">
      <View className="flex-grow">
        <TouchableOpacity onPress={() => router.push(`/spell/${spell.id}`)}>
          <Text className="text-xl font-semibold text-green-400">
            {spell.name}
          </Text>
          <Text className="mt-2 text-white">{spell.shortDescription}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type Level = keyof typeof druidTable;
type Mod = keyof typeof modTable;

const Index = () => {
  // const utils = api.useContext();

  const spellQuery = api.spell.all.useQuery();

  const [level, setLevel] = useState<Level>(1);
  const [modifier, setModifier] = useState<Mod>(0);

  useEffect(() => {
    (async () => {
      try {
        const levelValue = await getValueFor("level");
        const modValue = await getValueFor("modifier");
        console.log(modValue, levelValue);
        levelValue && setLevel(+levelValue as Level);
        modValue && setModifier(+modValue as Mod);
      } catch (e) {
        alert(e);
      }
    })();
  }, []);

  const spellsByLevel = spellQuery.data?.reduce((acc, spell) => {
    const level = spell.level;
    for (let i = 0; i <= 9; i++) {
      if (level.includes(`Drd ${i}`)) {
        if (!acc[i]) {
          acc[i] = [];
        }
        acc[i]?.push(spell);
      }
    }
    return acc;
  }, {} as { [key in number]: Spell[] });

  if (!spellsByLevel) return;

  const spellsByLevelInSections = Object.keys(spellsByLevel).map((key) => {
    return {
      title: key,
      data: spellsByLevel[+key] as Spell[],
    };
  });

  const tableData = Array(10)
    .fill(null)
    .map((_, index) => {
      const spellLevel = index.toString();
      const spellValue = druidTable[level][index]
        ? druidTable[level][index] + modTable[modifier][index]
        : 0;

      return [spellLevel, spellValue.toString()];
    });

  return (
    <SafeAreaView className="bg-amber-900">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Druidzki almanach" }} />
      <View className="h-full w-full p-4">
        <View className="py-2">
          <Text className="font-semibold italic text-white">
            Poziom druida:{" "}
          </Text>
          <Picker
            selectedValue={level}
            onValueChange={async (level, itemIndex) => {
              setLevel(level);
              await save("level", String(level));
            }}
          >
            {[...Array(20)].map((_, index) => (
              <Picker.Item
                key={index}
                label={`${index + 1}`}
                value={index + 1}
                color="black"
              />
            ))}
          </Picker>

          {/* <View className="flex flex-row"> */}
          <Text className="font-semibold italic text-white">
            Modyfikator roztropności:{" "}
          </Text>
          <Picker
            selectedValue={modifier}
            onValueChange={async (mod, itemIndex) => {
              setModifier(mod);
              await save("modifier", String(mod));
            }}
          >
            {[...Array(11)].map((_, index) => (
              <Picker.Item
                key={index}
                label={`${index}`}
                value={index}
                color="black"
              />
            ))}
          </Picker>
          {/* </View> */}
          <Text className="font-semibold italic text-white">
            Czary na dzień:
          </Text>
          <View className="flex flex-row">
            {tableData.map(([spell, value], index) => (
              <View key={index} className="flex flex-col">
                <Text className="text-lg font-semibold italic text-white">
                  {spell} |{" "}
                </Text>
                <Text className="text-lg text-white">{value} | </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="py-2">
          <Text className="font-semibold italic text-white">Wybierz czar </Text>
        </View>
        <SectionList
          sections={spellsByLevelInSections}
          keyExtractor={(item, index) => item.name + index}
          renderItem={({ item }) => <SpellCard spell={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="font-semibold italic text-white">
              Czary poziomu {title}
            </Text>
          )}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
