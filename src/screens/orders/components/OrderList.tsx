import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Order } from '@/types';
import OrderItem from './OrderItem';
import { Button } from '@/components';
import { useNavigation } from '@react-navigation/native';
import navigationNames from '@/navigation/navigationNames';

interface Props {
  orders: Order[];
}

export const OrderList = ({ orders }: Props) => {
  const navigation = useNavigation();

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}> You have no orders yet.</Text>
        <Button
          title="Go Shop Now"
          style={styles.btnGo}
          onPress={() => navigation.navigate(navigationNames.homeTab)}
        />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={orders}
        renderItem={(item) => <OrderItem order={item.item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    textAlign: 'center',
  },
  btnGo: {
    marginTop: 20,
  },
  container: {
    paddingVertical: 20,
  },
});