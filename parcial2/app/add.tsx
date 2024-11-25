import { Text, View, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { addTeam } from "../app/api";

const AddTeam = () => {
  const router = useRouter();
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    goals: 0,
    points: 0,
    logo: "",
  });

  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.description) {
      alert("Please fill in all the fields");
      return;
    }

    const addedTeam = await addTeam(newTeam);

    if (addedTeam) {
      alert("Team added successfully");
      router.push("/"); 
    } else {
      alert("Error adding the team");
    }
  };

  const handleCancel = () => {
    router.push("/"); 
  };

  return (
    <ScrollView
      style={{
        flex: 1,
      }}
    >
      <Stack.Screen
        options={{
          title: "Add Team",
          headerStyle: { backgroundColor: "#020127" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    <View style={{ padding: 16, flex: 1, justifyContent: "center" }}>
      <TextInput
        placeholder="Name"
        value={newTeam.name}
        onChangeText={(text) => setNewTeam({ ...newTeam, name: text })}
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Description"
        value={newTeam.description}
        onChangeText={(text) =>
          setNewTeam({ ...newTeam, description: text })
        }
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Goals"
        keyboardType="numeric"
        value={newTeam.goals.toString()}
        onChangeText={(text) =>
          setNewTeam({ ...newTeam, goals: parseInt(text) || 0 })
        }
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Points"
        keyboardType="numeric"
        value={newTeam.points.toString()}
        onChangeText={(text) =>
          setNewTeam({ ...newTeam, points: parseInt(text) || 0 })
        }
        style={{
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
      <TextInput
        placeholder="Image URL (optional)"
        value={newTeam.logo}
        onChangeText={(text) => setNewTeam({ ...newTeam, logo: text })}
        style={{
          marginBottom: 16,
          borderBottomWidth: 1,
          borderColor: "#ccc",
          padding: 8,
        }}
      />
        <View style={styles.buttonContainer}>
          <Button title="Add Team" onPress={handleAddTeam} />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={handleCancel} color="red" />
        </View>    
      </View>
    </ScrollView>
  );
};

export default AddTeam;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
});
