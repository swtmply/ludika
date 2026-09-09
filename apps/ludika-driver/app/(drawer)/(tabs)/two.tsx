import { Card } from "heroui-native/card";
import { View } from "react-native";

import { Container } from "@ludika/mobile-ui";

export default function TabTwo() {
  return (
    <Container className="p-6">
      <View className="flex-1 justify-center items-center">
        <Card variant="secondary" className="p-8 items-center">
          <Card.Title className="text-3xl mb-2">TabTwo</Card.Title>
        </Card>
      </View>
    </Container>
  );
}
