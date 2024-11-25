import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator, Image } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById, deleteTeamById, updateTeamById } from "./api";

type Team = {
  name: string;
  description: string;
  goals: number;
  points: string;
  logo?: string;
};

const Details = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    name: "",
    description: "",
    goals: 0,
    points: 0,
    logo: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await getInfoById(params.id as string);
        if (!response) throw new Error("Team not found");
        setTeam(response);
        setEditValues({
          name: response.name || "",
          description: response.description || "",
          goals: response.goals || "",
          points: response.points || "",
          logo: response.logo || "",
        });
      } catch (error) {
        Alert.alert("Error", "Planet not found or error loading details.");
        router.push("/"); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleDelete = async () => {
    try {
      await deleteTeamById(params.id as string);
      Alert.alert("Team deleted", "The team has been deleted.");
      router.push("/"); 
    } catch (error) {
      Alert.alert("Error", "There was an error deleting the team.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editValues.name.trim() || !editValues.description.trim()) {
      Alert.alert("Error", "Name and description are required.");
      return;
    }
    if (isNaN(editValues.points) || editValues.points < 0) {
      Alert.alert("Error", "Please enter a valid number of points.");
      return;
    }

    try {
      const updatedTeam = {
        ...editValues,
        points: parseInt(editValues.points.toString(), 10),
        goals: parseInt(editValues.goals.toString(), 10),
        logo: editValues.logo.trim() || team?.logo,
        
      };

      console.log(updatedTeam);
      console.log(updatedTeam.logo);

      const response = await updateTeamById(params.id as string, updatedTeam);

      if (response) {
        setTeam(response);
        setIsEditing(false);
        Alert.alert("Team updated", "The team has been updated.");
      } else {
        throw new Error("Error updating team");
      }
    } catch (error) {
      Alert.alert("Error", "There was an error updating the team.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Team not found.</Text>
        <TouchableOpacity onPress={() => router.push("/")} style={styles.goBackButton}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log(team);
  console.log(team.logo);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Details",
          headerStyle: { backgroundColor: "#020127" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <View style={styles.card}>
        <Text style={styles.title}>{team.name} Details:</Text>
        {team.logo ? (
          <Image source={{ uri: team.logo }} style={styles.image} />
        ) : (
          <Text>No image available</Text> 
        )}
        {!isEditing ? (
          <>
            <Text style={styles.description}>Description: {team.description}</Text>
            <Text style={styles.description}>Goals Amount: {team.goals}</Text>
            <Text style={styles.description}>Points Amount: {team.points}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Edit Team:</Text>
            <TextInput
              style={styles.input}
              value={editValues.name}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, name: text }))}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={editValues.description}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, description: text }))}
              placeholder="Description"
            />
            <TextInput
              style={styles.input}
              value={editValues.goals.toString()}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, goals: parseInt(text, 10) || 0 }))}
              placeholder="Number of Goals"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editValues.points.toString()}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, points: parseInt(text, 10) || 0 }))}
              placeholder="Number of Points"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editValues.logo}
              onChangeText={(text) => setEditValues((prev) => ({ ...prev, logo: text }))}
              placeholder="Image URL"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};


export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 75,
  },
  description: {
    fontWeight: "normal",
    marginBottom: 8,
    textAlign: "left",
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  addButton: {
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#dc3545",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  editButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007bff",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#6c757d",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  saveButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#28a745",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 16,
  },
  goBackButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007bff",
  },
});