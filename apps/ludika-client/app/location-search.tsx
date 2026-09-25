import { MapsLocation01Icon, PinLocation01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useThemeColor } from "heroui-native/hooks";
import { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { Container, FloatingSearchBar } from "@ludika/mobile-ui";
import { useOrderDraft } from "@/components/order-draft-context";
import { trpc } from "@/utils/trpc";

/** Shape returned by the location.search tRPC procedure. */
export type AvailablePlace = {
  id: string;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
};

const DEBOUNCE_MS = 300;

export default function LocationSearchScreen() {
  const { type = "pickup" } = useLocalSearchParams<{
    type?: "pickup" | "dropoff";
  }>();
  const isPickup = type === "pickup";
  const { update } = useOrderDraft();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const _mutedColor = useThemeColor("muted");
  const _accentColor = useThemeColor("accent");

  // Debounce the search input so we don't fire a request on every keystroke.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const {
    data: places = [],
    isFetching,
    isError,
  } = useQuery({
    ...trpc.location.search.queryOptions({ query: debouncedQuery }),
    enabled: debouncedQuery.length > 0,
  });

  // Ping the server on mount to confirm connectivity in the server
  const {
    data: pingData,
    isLoading: isPinging,
    isError: isPingError,
  } = useQuery({
    ...trpc.location.ping.queryOptions(),
    retry: 2,
    staleTime: 30_000,
  });

  const _serverOnline = !isPinging && !isPingError && !!pingData?.ok;

  const hasExactMatch = places.some(
    (place) => place.name.toLowerCase() === debouncedQuery.toLowerCase(),
  );

  function handleSelectPlace(place: {
    name: string;
    latitude: number | null;
    longitude: number | null;
  }) {
    if (isPickup) {
      update({
        pickup: {
          label: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        },
      });
    } else {
      update({
        dropoff: {
          label: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
        },
      });
    }
    router.back();
  }

  return (
    <Container isScrollable={false} className="flex-1 bg-white pt-4">
      <FloatingSearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={isPickup ? "Search pickup location" : "Search drop-off location"}
        autoFocus
        isLoading={isFetching}
        leftIcon={
          <HugeiconsIcon icon={PinLocation01Icon} size={21} color="#111827" strokeWidth={1.8} />
        }
      />

      {/* Places List */}
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          query.trim().length > 0 && !hasExactMatch ? (
            <Pressable
              onPress={() =>
                handleSelectPlace({
                  name: query.trim(),
                  latitude: null,
                  longitude: null,
                })
              }
              className="flex-row items-start gap-3 py-3 border-b border-slate-100 active:opacity-60"
            >
              <View className="mt-0.5">
                <HugeiconsIcon icon={PinLocation01Icon} size={18} color="#000000" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-semibold text-sm mb-0.5" numberOfLines={1}>
                  {query.trim()}
                </Text>
                <Text className="text-slate-400 text-xs">Custom location</Text>
              </View>
            </Pressable>
          ) : null
        }
        ListEmptyComponent={
          debouncedQuery.length === 0 ? (
            <View className="items-center justify-center py-12">
              <HugeiconsIcon icon={Search01Icon} size={32} color="#A1A1AA" />
              <Text className="text-slate-900 font-medium text-sm mt-3">
                Start typing to search
              </Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                Search for a place, street, or address above.
              </Text>
            </View>
          ) : isError ? (
            <View className="items-center justify-center py-12">
              <HugeiconsIcon icon={MapsLocation01Icon} size={32} color="#A1A1AA" />
              <Text className="text-slate-900 font-medium text-sm mt-3">Search unavailable</Text>
              <Text className="text-slate-400 text-xs text-center mt-1">
                Could not reach geocoding service.
              </Text>
            </View>
          ) : !isFetching ? (
            <View className="items-center justify-center py-12">
              <HugeiconsIcon icon={MapsLocation01Icon} size={32} color="#A1A1AA" />
              <Text className="text-slate-900 font-medium text-sm mt-3">No matching locations</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              handleSelectPlace({
                name: item.name,
                latitude: item.latitude,
                longitude: item.longitude,
              })
            }
            className="flex-row items-start gap-3 py-3 border-b border-slate-100 active:opacity-60"
          >
            <View className="mt-0.5">
              <HugeiconsIcon icon={PinLocation01Icon} size={18} color="#000000" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-900 font-semibold text-sm mb-0.5" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-slate-400 text-xs leading-4" numberOfLines={2}>
                {item.address}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </Container>
  );
}
