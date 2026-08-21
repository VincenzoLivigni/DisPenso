import { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type FiltersProps = {
    search: string
    onChangeSearch: (text:string) => void
}

export default function Filters({ search, onChangeSearch }: FiltersProps) {

    return (
        <>
            <View style={styles.filteredContainer}>
                               
              <Text>Cerca prodotto</Text>
                <TextInput
                    placeholder="nome prodotto"
                    value={search}
                    onChangeText={onChangeSearch}
                    style={styles.input}
                /> 

            </View>
        </>
    )
}


const styles = StyleSheet.create({
    filteredContainer: {
        marginHorizontal: 13,
        marginVertical: 15,
        gap: 10,
    },
      input: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#6e6e6e",
        borderRadius: 10
    }
})